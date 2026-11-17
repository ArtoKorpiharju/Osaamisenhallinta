package com.osaamisenhallinta.qualification;

import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.osaamisenhallinta.competency.dto.CompetencyDto;
import com.osaamisenhallinta.qualification.dto.QualificationDto;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.server.ResponseStatusException;

@WebMvcTest(QualificationController.class)
class QualificationControllerTest {
  @Autowired private MockMvc mockMvc;

  @MockitoBean private QualificationService qualificationService;

  @MockitoBean private QualificationDto mockQualificationDto;

  @MockitoBean private CompetencyDto mockCompetencyDto;

  private final Long qualificationId = 1L;

  private final Long competencyId = 1L;

  private final Long testCompetencyId = 999L;

  @BeforeEach
  void setUp() {
    lenient().when(mockQualificationDto.qualificationId()).thenReturn(qualificationId);
    lenient().when(mockQualificationDto.qualificationName()).thenReturn("Warehouse Operator");
    lenient().when(mockQualificationDto.requiredCompetencies())
      .thenReturn(List.of(mockCompetencyDto));
    lenient().when(mockCompetencyDto.competencyId()).thenReturn(competencyId);
  }

  @Test
  void getQualificationById_ShouldReturnOkAndQualificationDtoWhenSuccessful() throws Exception {
    when(qualificationService.getQualificationById(qualificationId))
        .thenReturn(mockQualificationDto);

    mockMvc.perform(get("/api/qualifications/{id}", qualificationId))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.qualificationId").value(qualificationId))
        .andExpect(jsonPath("$.qualificationName").value(mockQualificationDto.qualificationName()))
        .andExpect(jsonPath("$.requiredCompetencies.length()").value(1))
        .andExpect(jsonPath("$.requiredCompetencies[0].competencyId")
          .value(competencyId));

    verify(qualificationService).getQualificationById(qualificationId);
  }

  @Test
  void getQualificationById_ShouldReturnBadRequestWhenIdInvalid() throws Exception {
    mockMvc.perform(get("/api/qualifications/abc"))
        .andExpect(status().isBadRequest());

    verifyNoInteractions(qualificationService);
  }  

  @Test 
  void getQualificationById_ShouldReturnNotFoundWhenQualificationDoesNotExist() throws Exception {
    when(qualificationService.getQualificationById(qualificationId))
        .thenThrow(new ResponseStatusException(HttpStatus.NOT_FOUND, "Qualification not found"));

    mockMvc.perform(get("/api/qualifications/{id}", qualificationId))
        .andExpect(status().isNotFound());
     
    verify(qualificationService).getQualificationById(qualificationId);
  }

  @Test 
  void getAllQualifications_ShouldReturnOkAndCorrectList() throws Exception {
    when(qualificationService.getAllQualifications())
        .thenReturn(List.of(mockQualificationDto));
    
    mockMvc.perform(get("/api/qualifications"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.length()").value(1))
        .andExpect(jsonPath("$[0].qualificationName")
          .value(mockQualificationDto.qualificationName()));

    verify(qualificationService).getAllQualifications();
  }

  @Test 
  void getAllQualifications_ShouldReturnOkAndEmptyList() throws Exception {
    when(qualificationService.getAllQualifications())
        .thenReturn(List.of());
    
    mockMvc.perform(get("/api/qualifications"))
        .andExpect(status().isOk())
        .andExpect(content().json("[]"));

    verify(qualificationService).getAllQualifications();
  }

  @Test 
  void createQualification_ShouldReturnCreatedAndQualificationDtoWhenSuccessful() throws Exception {
    when(qualificationService.createQualification(
      mockQualificationDto.qualificationName(),
      List.of(competencyId)))
        .thenReturn(mockQualificationDto);

    mockMvc.perform(post("/api/qualifications")
        .contentType(MediaType.APPLICATION_JSON)
        .content("""
            {
                "name": "Warehouse Operator",
                "requiredCompetenciesIds": [1]
            }
            """))
        .andExpect(status().isCreated())
        .andExpect(jsonPath("$.qualificationId").value(qualificationId))
        .andExpect(jsonPath("$.qualificationName")
          .value(mockQualificationDto.qualificationName()))
        .andExpect(jsonPath("$.requiredCompetencies.length()").value(1))
        .andExpect(jsonPath("$.requiredCompetencies[0].competencyId")
          .value(competencyId));

    verify(qualificationService).createQualification(
        mockQualificationDto.qualificationName(),
        List.of(competencyId));
  }

  @Test
  void createQualification_ShouldReturnBadRequestWhenNameMissing() throws Exception {
    mockMvc.perform(post("/api/qualifications")
        .contentType(MediaType.APPLICATION_JSON)
        .content("""
            {
                "name": "",
                "requiredCompetenciesIds": [1]
            }
            """))
        .andExpect(status().isBadRequest());

    verifyNoInteractions(qualificationService);
  }

  @Test
  void createQualification_ShouldReturnBadRequestWhenNameLongerThan255Characters() 
      throws Exception {
    String longName = "A".repeat(257);
    mockMvc.perform(post("/api/qualifications")
        .contentType(MediaType.APPLICATION_JSON)
        .content("""
            {
                "name": "%s",
                "requiredCompetenciesIds": [1]
            }
            """.formatted(longName)))
        .andExpect(status().isBadRequest());

    verifyNoInteractions(qualificationService);
  }

  @Test
  void createQualification_ShouldReturnBadRequestWhenRequiredCompetenciesMissing() 
      throws Exception {
    mockMvc.perform(post("/api/qualifications")
        .contentType(MediaType.APPLICATION_JSON)
        .content("""
            {
                "name": "Warehouse Operator",
                "requiredCompetenciesIds": []
            }
            """))
        .andExpect(status().isBadRequest());

    verifyNoInteractions(qualificationService);
  }

  @Test
  void createQualification_ShouldReturnBadRequestWhenJsonMalformed() throws Exception {
    mockMvc.perform(post("/api/qualifications")
        .contentType(MediaType.APPLICATION_JSON)
        .content("""
            {
                "name": "Warehouse Operator,
                "requiredCompetenciesIds": [1]
            }
            """))
        .andExpect(status().isBadRequest());

    verifyNoInteractions(qualificationService);
  }

  @Test 
  void createQualification_ShouldReturnNotFoundWhenSomeRequiredCompetenciesNotFound() 
      throws Exception {
    when(qualificationService.createQualification(
        mockQualificationDto.qualificationName(),
        List.of(competencyId, testCompetencyId)))
          .thenThrow(new ResponseStatusException(HttpStatus.NOT_FOUND, 
            "Some required competencies not found"));

    mockMvc.perform(post("/api/qualifications")
        .contentType(MediaType.APPLICATION_JSON)
        .content("""
            {
                "name": "Warehouse Operator",
                "requiredCompetenciesIds": [1, 999]
            }
            """))
        .andExpect(status().isNotFound());

    verify(qualificationService).createQualification(
        mockQualificationDto.qualificationName(),
        List.of(competencyId, testCompetencyId));
  }

  @Test
  void createQualification_ShouldReturnConflictWhenQualificationExists() throws Exception {
    when(qualificationService.createQualification(
        mockQualificationDto.qualificationName(),
        List.of(competencyId)))
          .thenThrow(new ResponseStatusException(
            HttpStatus.CONFLICT, "Qualification already exists"));

    mockMvc.perform(post("/api/qualifications")
        .contentType(MediaType.APPLICATION_JSON)
        .content("""
            {
                "name": "Warehouse Operator",
                "requiredCompetenciesIds": [1]
            }
            """))
        .andExpect(status().isConflict());

    verify(qualificationService).createQualification(
        mockQualificationDto.qualificationName(),
        List.of(competencyId));
  }

  @Test 
  void deleteQualification_ShouldReturnNoContentWhenDeletionSuccessful() throws Exception {
    mockMvc.perform(delete("/api/qualifications/{id}", qualificationId))
        .andExpect(status().isNoContent());

    verify(qualificationService).deleteQualification(qualificationId);
  }

  @Test
  void deleteQualification_ShouldReturnBadRequestWhenIdInvalid() throws Exception {
    mockMvc.perform(delete("/api/qualifications/abc"))
        .andExpect(status().isBadRequest());
    
    verifyNoInteractions(qualificationService);
  }

  @Test 
  void deleteQualification_ShouldReturnNotFoundWhenQualificationDoesNotExist() throws Exception {
    doThrow(new ResponseStatusException(HttpStatus.NOT_FOUND))
        .when(qualificationService).deleteQualification(qualificationId);

    mockMvc.perform(delete("/api/qualifications/{id}", qualificationId))
        .andExpect(status().isNotFound());

    verify(qualificationService).deleteQualification(qualificationId);
  }
}
