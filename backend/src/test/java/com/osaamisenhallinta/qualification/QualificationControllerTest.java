package com.osaamisenhallinta.qualification;

import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.osaamisenhallinta.competency.dto.CompetencyDto;
import com.osaamisenhallinta.qualification.dto.QualificationDto;
import java.util.List;
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
  
  private CompetencyDto competencyDto = new CompetencyDto(
      1L,
      null,
      null,
      null);

  private QualificationDto qualificationDto = new QualificationDto(
      1L, 
      "Warehouse Operator", 
      List.of(competencyDto));

  private QualificationDto updatedDto = new QualificationDto(
      1L, 
      "New name", 
      List.of(competencyDto));

  private final Long testCompetencyId = 999L;

  @Test
  void getQualificationById_ShouldReturnOkAndQualificationDtoWhenSuccessful() throws Exception {
    when(qualificationService.getQualificationById(qualificationDto.qualificationId()))
        .thenReturn(qualificationDto);

    mockMvc.perform(get("/api/qualifications/{id}", qualificationDto.qualificationId()))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.qualificationId").value(qualificationDto.qualificationId()))
        .andExpect(jsonPath("$.qualificationName").value(qualificationDto.qualificationName()))
        .andExpect(jsonPath("$.requiredCompetencies.length()").value(1))
        .andExpect(jsonPath("$.requiredCompetencies[0].competencyId")
          .value(competencyDto.competencyId()));

    verify(qualificationService).getQualificationById(qualificationDto.qualificationId());
  }

  @Test
  void getQualificationById_ShouldReturnBadRequestWhenIdInvalid() throws Exception {
    mockMvc.perform(get("/api/qualifications/abc"))
        .andExpect(status().isBadRequest());

    verifyNoInteractions(qualificationService);
  }  

  @Test 
  void getQualificationById_ShouldReturnNotFoundWhenQualificationDoesNotExist() throws Exception {
    when(qualificationService.getQualificationById(qualificationDto.qualificationId()))
        .thenThrow(new ResponseStatusException(HttpStatus.NOT_FOUND, "Qualification not found"));

    mockMvc.perform(get("/api/qualifications/{id}", qualificationDto.qualificationId()))
        .andExpect(status().isNotFound());
     
    verify(qualificationService).getQualificationById(qualificationDto.qualificationId());
  }

  @Test 
  void getAllQualifications_ShouldReturnOkAndCorrectListWithOnlyOneQualification() 
      throws Exception {
    when(qualificationService.getAllQualifications())
        .thenReturn(List.of(qualificationDto));
    
    mockMvc.perform(get("/api/qualifications"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.length()").value(1))
        .andExpect(jsonPath("$[0].qualificationName")
          .value(qualificationDto.qualificationName()));

    verify(qualificationService).getAllQualifications();
  }

  @Test 
  void getAllQualifications_ShouldReturnOkAndCorrectListWithMultipleQualifications() 
      throws Exception {
    QualificationDto mockQualificationDto = new QualificationDto(
        2L,
        "Testing",
        List.of(competencyDto)
    );
    when(qualificationService.getAllQualifications())
        .thenReturn(List.of(qualificationDto, mockQualificationDto));
    
    mockMvc.perform(get("/api/qualifications"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.length()").value(2))
        .andExpect(jsonPath("$[0].qualificationName")
          .value(qualificationDto.qualificationName()));

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
      qualificationDto.qualificationName(),
      List.of(competencyDto.competencyId())))
        .thenReturn(qualificationDto);

    mockMvc.perform(post("/api/qualifications")
        .contentType(MediaType.APPLICATION_JSON)
        .content("""
            {
                "name": "Warehouse Operator",
                "requiredCompetenciesIds": [1]
            }
            """))
        .andExpect(status().isCreated())
        .andExpect(jsonPath("$.qualificationId").value(qualificationDto.qualificationId()))
        .andExpect(jsonPath("$.qualificationName")
          .value(qualificationDto.qualificationName()))
        .andExpect(jsonPath("$.requiredCompetencies.length()").value(1))
        .andExpect(jsonPath("$.requiredCompetencies[0].competencyId")
          .value(competencyDto.competencyId()));

    verify(qualificationService).createQualification(
        qualificationDto.qualificationName(),
        List.of(competencyDto.competencyId()));
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
    String longName = "A".repeat(256);
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
  void createQualification_ShouldReturnBadRequestWhenRequiredCompetencyIdNull() throws Exception {
    mockMvc.perform(post("/api/qualifications")
        .contentType(MediaType.APPLICATION_JSON)
        .content("""
            {
                "name": "Warehouse Operator",
                "requiredCompetenciesIds": [null]
            }
            """))
        .andExpect(status().isBadRequest());

    verifyNoInteractions(qualificationService);
  }

  @Test
  void createQualification_ShouldReturnBadRequestWhenRequiredCompetencyIdNotUnique() 
      throws Exception {
    mockMvc.perform(post("/api/qualifications")
        .contentType(MediaType.APPLICATION_JSON)
        .content("""
            {
                "name": "Warehouse Operator",
                "requiredCompetenciesIds": [1, 1]
            }
            """))
        .andExpect(status().isBadRequest());

    verifyNoInteractions(qualificationService);
  }

  @Test 
  void createQualification_ShouldReturnNotFoundWhenSomeRequiredCompetenciesNotFound() 
      throws Exception {
    when(qualificationService.createQualification(
        qualificationDto.qualificationName(),
        List.of(competencyDto.competencyId(), testCompetencyId)))
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
        qualificationDto.qualificationName(),
        List.of(competencyDto.competencyId(), testCompetencyId));
  }

  @Test
  void createQualification_ShouldReturnConflictWhenQualificationExists() throws Exception {
    when(qualificationService.createQualification(
        qualificationDto.qualificationName(),
        List.of(competencyDto.competencyId())))
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
        qualificationDto.qualificationName(),
        List.of(competencyDto.competencyId()));
  }

  @Test 
  void deleteQualification_ShouldReturnNoContentWhenDeletionSuccessful() throws Exception {
    mockMvc.perform(delete("/api/qualifications/{id}", qualificationDto.qualificationId()))
        .andExpect(status().isNoContent());

    verify(qualificationService).deleteQualification(qualificationDto.qualificationId());
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
        .when(qualificationService).deleteQualification(qualificationDto.qualificationId());

    mockMvc.perform(delete("/api/qualifications/{id}", qualificationDto.qualificationId()))
        .andExpect(status().isNotFound());

    verify(qualificationService).deleteQualification(qualificationDto.qualificationId());
  }

  @Test
  void updateQualification_ShouldReturnOkAndQualificationDtoWhenSuccessful() throws Exception {
    when(qualificationService.updateQualification(
        qualificationDto.qualificationId(),
        updatedDto.qualificationName(),
        List.of(competencyDto.competencyId())))
        .thenReturn(updatedDto);

    mockMvc.perform(put("/api/qualifications/{id}", qualificationDto.qualificationId())
        .contentType(MediaType.APPLICATION_JSON)
        .content("""
            {
                "name": "New name",
                "requiredCompetenciesIds": [1]
            }
            """))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.qualificationId").value(updatedDto.qualificationId()))
        .andExpect(jsonPath("$.qualificationName").value(updatedDto.qualificationName()))
        .andExpect(jsonPath("$.requiredCompetencies.length()").value(1))
        .andExpect(jsonPath("$.requiredCompetencies[0].competencyId")
          .value(competencyDto.competencyId()));

    verify(qualificationService).updateQualification(
        qualificationDto.qualificationId(),
        updatedDto.qualificationName(),
        List.of(competencyDto.competencyId()));
  }

  @Test
  void updateQualification_ShouldReturnBadRequestWhenIdInvalid() throws Exception {
    mockMvc.perform(put("/api/qualifications/abc"))
        .andExpect(status().isBadRequest());
    
    verifyNoInteractions(qualificationService);
  }

  @Test
  void updateQualification_ShouldReturnBadRequestWhenNameMissing() throws Exception {
    mockMvc.perform(put("/api/qualifications/{id}", qualificationDto.qualificationId())
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
  void updateQualification_ShouldReturnBadRequestWhenNameLongerThan255Characters() 
      throws Exception {
    String longName = "A".repeat(256);
    mockMvc.perform(put("/api/qualifications/{id}", qualificationDto.qualificationId())
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
  void updateQualification_ShouldReturnBadRequestWhenRequiredCompetenciesMissing() 
      throws Exception {
    mockMvc.perform(put("/api/qualifications/{id}", qualificationDto.qualificationId())
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
  void updateQualification_ShouldReturnBadRequestWhenJsonMalformed() throws Exception {
    mockMvc.perform(put("/api/qualifications/{id}", qualificationDto.qualificationId())
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
  void updateQualification_ShouldReturnBadRequestWhenRequiredCompetencyIdNull() throws Exception {
    mockMvc.perform(put("/api/qualifications/{id}", qualificationDto.qualificationId())
        .contentType(MediaType.APPLICATION_JSON)
        .content("""
            {
                "name": "Warehouse Operator",
                "requiredCompetenciesIds": [null]
            }
            """))
        .andExpect(status().isBadRequest());

    verifyNoInteractions(qualificationService);
  }

  @Test
  void updateQualification_ShouldReturnBadRequestWhenRequiredCompetencyIdNotUnique() 
      throws Exception {
    mockMvc.perform(put("/api/qualifications/{id}", qualificationDto.qualificationId())
        .contentType(MediaType.APPLICATION_JSON)
        .content("""
            {
                "name": "Warehouse Operator",
                "requiredCompetenciesIds": [1, 1]
            }
            """))
        .andExpect(status().isBadRequest());

    verifyNoInteractions(qualificationService);
  }

  @Test 
  void updateQualification_ShouldReturnNotFoundWhenSomeRequiredCompetenciesNotFound() 
      throws Exception {
    when(qualificationService.updateQualification(
        qualificationDto.qualificationId(),
        updatedDto.qualificationName(),
        List.of(competencyDto.competencyId(), testCompetencyId)))
          .thenThrow(new ResponseStatusException(HttpStatus.NOT_FOUND, 
            "Some required competencies not found"));

    mockMvc.perform(put("/api/qualifications/{id}", qualificationDto.qualificationId())
        .contentType(MediaType.APPLICATION_JSON)
        .content("""
            {
                "name": "New name",
                "requiredCompetenciesIds": [1, 999]
            }
            """))
        .andExpect(status().isNotFound());

    verify(qualificationService).updateQualification(
        qualificationDto.qualificationId(),
        updatedDto.qualificationName(),
        List.of(competencyDto.competencyId(), testCompetencyId));
  }

  @Test
  void updateQualification_ShouldReturnNotFoundWhenQualificationDoesNotExist() throws Exception {
    when(qualificationService.updateQualification(
        qualificationDto.qualificationId(),
        updatedDto.qualificationName(),
        List.of(competencyDto.competencyId())))
        .thenThrow(new ResponseStatusException(HttpStatus.NOT_FOUND, "Qualification not found"));

    mockMvc.perform(put("/api/qualifications/{id}", qualificationDto.qualificationId())
        .contentType(MediaType.APPLICATION_JSON)
        .content("""
            {
                "name": "New name",
                "requiredCompetenciesIds": [1]
            }
            """))
        .andExpect(status().isNotFound());
     
    verify(qualificationService).updateQualification(
        qualificationDto.qualificationId(),
        updatedDto.qualificationName(),
        List.of(competencyDto.competencyId()));
  }

  @Test 
  void updateQualification_ShouldReturnConflictWhenQualificationUnderThisNameExists() 
      throws Exception {
    String duplicateName = "First Aid Responder";
    when(qualificationService.updateQualification(
        qualificationDto.qualificationId(),
        duplicateName,
        List.of(competencyDto.competencyId())))
        .thenThrow(new ResponseStatusException(
          HttpStatus.CONFLICT, "Qualification under this name already exists"));

    mockMvc.perform(put("/api/qualifications/{id}", qualificationDto.qualificationId())
        .contentType(MediaType.APPLICATION_JSON)
        .content("""
            {
                "name": "First Aid Responder",
                "requiredCompetenciesIds": [1]
            }
            """))
        .andExpect(status().isConflict());

    verify(qualificationService).updateQualification(
        qualificationDto.qualificationId(),
        duplicateName,
        List.of(competencyDto.competencyId()));
  }
}
