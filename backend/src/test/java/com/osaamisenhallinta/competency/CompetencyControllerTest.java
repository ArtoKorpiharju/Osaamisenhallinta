package com.osaamisenhallinta.competency;

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

@WebMvcTest(CompetencyController.class)
class CompetencyControllerTest {
  @Autowired private MockMvc mockMvc;

  @MockitoBean CompetencyService competencyService;

  @MockitoBean private CompetencyDto mockCompetencyDto;

  private final Long competencyId = 1L;

  @BeforeEach
  void setUp() {
    lenient().when(mockCompetencyDto.competencyId()).thenReturn(competencyId);
    lenient().when(mockCompetencyDto.competencyName()).thenReturn("Fire Safety Training");
    lenient().when(mockCompetencyDto.competencyType()).thenReturn(CompetencyType.TRAINING);
    lenient().when(mockCompetencyDto.validityMonths()).thenReturn(12);
  }

  @Test 
  void getCompetencyById_ShouldReturnOkAndCompetencyDtoWhenSuccessful() throws Exception {
    when(competencyService.getCompetencyById(competencyId))
        .thenReturn(mockCompetencyDto);

    mockMvc.perform(get("/api/competencies/{id}", competencyId))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.competencyId").value(competencyId))
        .andExpect(jsonPath("$.competencyName").value(mockCompetencyDto.competencyName()))
        .andExpect(jsonPath("$.competencyType").value(mockCompetencyDto.competencyType().name()))
        .andExpect(jsonPath("$.validityMonths").value(mockCompetencyDto.validityMonths()));

    verify(competencyService).getCompetencyById(competencyId);
  }

  @Test
  void getCompetencyById_ShouldReturnBadRequestWhenIdInvalid() throws Exception {
    mockMvc.perform(get("/api/competencies/abc"))
        .andExpect(status().isBadRequest());
    
    verifyNoInteractions(competencyService);
  }

  @Test
  void getCompetencyById_ShouldReturnNotFoundWhenCompetencyDoesntExist() throws Exception {
    when(competencyService.getCompetencyById(competencyId))
        .thenThrow(new ResponseStatusException(
          HttpStatus.NOT_FOUND, "Competency not found"));

    mockMvc.perform(get("/api/competencies/{id}", competencyId))
        .andExpect(status().isNotFound());

    verify(competencyService).getCompetencyById(competencyId);
  }

  @Test 
  void getAllCompetencies_ShouldReturnOkAndCorrectList() throws Exception {
    when(competencyService.getAllCompetencies())
        .thenReturn(List.of(mockCompetencyDto));
      
    mockMvc.perform(get("/api/competencies"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.length()").value(1))
        .andExpect(jsonPath("$[0].competencyName")
          .value(mockCompetencyDto.competencyName()));

    verify(competencyService).getAllCompetencies();
  }

  @Test 
  void getAllCompetencies_ShouldReturnOkAndEmptyList() throws Exception {
    when(competencyService.getAllCompetencies())
        .thenReturn(List.of());
      
    mockMvc.perform(get("/api/competencies"))
        .andExpect(status().isOk())
        .andExpect(content().json("[]"));

    verify(competencyService).getAllCompetencies();
  }

  @Test
  void createCompetency_ShouldReturnCreatedAndCompetencyDtoWhenSuccessful() throws Exception {
    when(competencyService.createCompetency(
      mockCompetencyDto.competencyName(), 
      mockCompetencyDto.competencyType(), 
      mockCompetencyDto.validityMonths()))
        .thenReturn(mockCompetencyDto);

    mockMvc.perform(post("/api/competencies")
        .contentType(MediaType.APPLICATION_JSON)
        .content("""
            {
                "name": "Fire Safety Training",
                "type": "TRAINING",
                "validityMonths": 12
            }
            """))
        .andExpect(status().isCreated())
        .andExpect(jsonPath("$.competencyName").value(mockCompetencyDto.competencyName()))
        .andExpect(jsonPath("$.competencyType").value(mockCompetencyDto.competencyType().name()))
        .andExpect(jsonPath("$.validityMonths").value(mockCompetencyDto.validityMonths()));

    verify(competencyService).createCompetency(
        mockCompetencyDto.competencyName(), 
        mockCompetencyDto.competencyType(), 
        mockCompetencyDto.validityMonths());
  }
  
  @Test
  void createCompetency_ShouldReturnBadRequestWhenNameMissing() throws Exception {
    mockMvc.perform(post("/api/competencies")
        .contentType(MediaType.APPLICATION_JSON)
        .content("""
            {
                "name": "",
                "type": "TRAINING",
                "validityMonths": 12
            }
            """))
        .andExpect(status().isBadRequest());

    verifyNoInteractions(competencyService);
  }

  @Test
  void createCompetency_ShouldReturnBadRequestWhenNameLongerThan255Characters() throws Exception {
    String longName = "A".repeat(257);
    mockMvc.perform(post("/api/competencies")
        .contentType(MediaType.APPLICATION_JSON)
        .content("""
            {
                "name": "%s",
                "type": "TRAINING",
                "validityMonths": 12
            }
            """.formatted(longName)))
        .andExpect(status().isBadRequest());

    verifyNoInteractions(competencyService);
  }

  @Test
  void createCompetency_ShouldReturnBadRequestWhenCompetencyTypeNull() throws Exception {
    mockMvc.perform(post("/api/competencies")
        .contentType(MediaType.APPLICATION_JSON)
        .content("""
            {
                "name": "Fire Safety Training",
                "type": null,
                "validityMonths": 12
            }
            """))
        .andExpect(status().isBadRequest());

    verifyNoInteractions(competencyService);
  }

  @Test
  void createCompetency_ShouldReturnBadRequestWhenValidityMonthsLessThanOne() throws Exception {
    mockMvc.perform(post("/api/competencies")
        .contentType(MediaType.APPLICATION_JSON)
        .content("""
            {
                "name": "Fire Safety Training",
                "type": "TRAINING",
                "validityMonths": 0
            }
            """))
        .andExpect(status().isBadRequest());

    verifyNoInteractions(competencyService);
  }

  @Test
  void createCompetency_ShouldReturnBadRequestWhenJsonMalformed() throws Exception {
    mockMvc.perform(post("/api/competencies")
        .contentType(MediaType.APPLICATION_JSON)
        .content("""
            {
                "name": "Fire Safety Training,
                "type": "TRAINING",
                "validityMonths": 12
            }
            """))
        .andExpect(status().isBadRequest());

    verifyNoInteractions(competencyService);
  }

  @Test
  void createCompetency_ShouldReturnConflictWhenCompetencyExists() throws Exception {
    when(competencyService.createCompetency(
        mockCompetencyDto.competencyName(), 
        mockCompetencyDto.competencyType(), 
        mockCompetencyDto.validityMonths()))
        .thenThrow(
          new ResponseStatusException(HttpStatus.CONFLICT, "Competency already exists"));

    mockMvc.perform(post("/api/competencies")
        .contentType(MediaType.APPLICATION_JSON)
        .content("""
            {
                "name": "Fire Safety Training",
                "type": "TRAINING",
                "validityMonths": 12
            }
            """))
        .andExpect(status().isConflict());

    verify(competencyService).createCompetency(
        mockCompetencyDto.competencyName(), 
        mockCompetencyDto.competencyType(), 
        mockCompetencyDto.validityMonths());
  }

  @Test 
  void deleteCompetency_ShouldReturnNoContentWhenDeletionSuccessful() throws Exception {
    mockMvc.perform(delete("/api/competencies/{id}", competencyId))
        .andExpect(status().isNoContent());

    verify(competencyService).deleteCompetency(competencyId);
  }

  @Test
  void deleteCompetency_ShouldReturnBadRequestWhenIdInvalid() throws Exception {
    mockMvc.perform(delete("/api/competencies/abc"))
        .andExpect(status().isBadRequest());
    
    verifyNoInteractions(competencyService);
  }
  
  @Test
  void deleteCompetency_ShouldReturnNotFoundWhenCompetencyDoesntExist() throws Exception {
    doThrow(new ResponseStatusException(HttpStatus.NOT_FOUND))
        .when(competencyService).deleteCompetency(competencyId);

    mockMvc.perform(delete("/api/competencies/{id}", competencyId))
        .andExpect(status().isNotFound());

    verify(competencyService).deleteCompetency(competencyId);
  }

  @Test 
  void deleteCompetency_ShouldReturnConflictWhenCompetencyInUse() throws Exception {
    doThrow(new ResponseStatusException(HttpStatus.CONFLICT))
        .when(competencyService).deleteCompetency(competencyId);

    mockMvc.perform(delete("/api/competencies/{id}", competencyId))
        .andExpect(status().isConflict());

    verify(competencyService).deleteCompetency(competencyId);
  }
}