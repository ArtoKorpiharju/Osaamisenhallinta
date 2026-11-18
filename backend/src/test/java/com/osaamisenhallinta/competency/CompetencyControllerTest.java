package com.osaamisenhallinta.competency;

import static org.mockito.Mockito.doThrow;
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

  @MockitoBean private CompetencyService competencyService;

  private CompetencyDto competencyDto = new CompetencyDto(
      1L,
      "Fire Safety Training",
      CompetencyType.TRAINING,
      12
  );

  @Test 
  void getCompetencyById_ShouldReturnOkAndCompetencyDtoWhenSuccessful() throws Exception {
    when(competencyService.getCompetencyById(competencyDto.competencyId()))
        .thenReturn(competencyDto);

    mockMvc.perform(get("/api/competencies/{id}", competencyDto.competencyId()))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.competencyId").value(competencyDto.competencyId()))
        .andExpect(jsonPath("$.competencyName").value(competencyDto.competencyName()))
        .andExpect(jsonPath("$.competencyType").value(competencyDto.competencyType().name()))
        .andExpect(jsonPath("$.validityMonths").value(competencyDto.validityMonths()));

    verify(competencyService).getCompetencyById(competencyDto.competencyId());
  }

  @Test
  void getCompetencyById_ShouldReturnBadRequestWhenIdInvalid() throws Exception {
    mockMvc.perform(get("/api/competencies/abc"))
        .andExpect(status().isBadRequest());
    
    verifyNoInteractions(competencyService);
  }

  @Test
  void getCompetencyById_ShouldReturnNotFoundWhenCompetencyDoesNotExist() throws Exception {
    when(competencyService.getCompetencyById(competencyDto.competencyId()))
        .thenThrow(new ResponseStatusException(
          HttpStatus.NOT_FOUND, "Competency not found"));

    mockMvc.perform(get("/api/competencies/{id}", competencyDto.competencyId()))
        .andExpect(status().isNotFound());

    verify(competencyService).getCompetencyById(competencyDto.competencyId());
  }

  @Test 
  void getAllCompetencies_ShouldReturnOkAndCorrectListWithOnlyOneCompetency() throws Exception {
    when(competencyService.getAllCompetencies())
        .thenReturn(List.of(competencyDto));
      
    mockMvc.perform(get("/api/competencies"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.length()").value(1))
        .andExpect(jsonPath("$[0].competencyName")
          .value(competencyDto.competencyName()));

    verify(competencyService).getAllCompetencies();
  }

  @Test 
  void getAllCompetencies_ShouldReturnOkAndCorrectListWithMultipleCompetencies() throws Exception {
    CompetencyDto mockCompetencyDto = new CompetencyDto(
        2L,
        "Testing",
        CompetencyType.OTHER,
        null
    );
    when(competencyService.getAllCompetencies())
        .thenReturn(List.of(competencyDto, mockCompetencyDto));
      
    mockMvc.perform(get("/api/competencies"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.length()").value(2))
        .andExpect(jsonPath("$[0].competencyName")
          .value(competencyDto.competencyName()));

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
      competencyDto.competencyName(), 
      competencyDto.competencyType(), 
      competencyDto.validityMonths()))
        .thenReturn(competencyDto);

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
        .andExpect(jsonPath("$.competencyName").value(competencyDto.competencyName()))
        .andExpect(jsonPath("$.competencyType").value(competencyDto.competencyType().name()))
        .andExpect(jsonPath("$.validityMonths").value(competencyDto.validityMonths()));

    verify(competencyService).createCompetency(
        competencyDto.competencyName(), 
        competencyDto.competencyType(), 
        competencyDto.validityMonths());
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
    String longName = "A".repeat(256);
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
        competencyDto.competencyName(), 
        competencyDto.competencyType(), 
        competencyDto.validityMonths()))
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
        competencyDto.competencyName(), 
        competencyDto.competencyType(), 
        competencyDto.validityMonths());
  }

  @Test 
  void deleteCompetency_ShouldReturnNoContentWhenDeletionSuccessful() throws Exception {
    mockMvc.perform(delete("/api/competencies/{id}", competencyDto.competencyId()))
        .andExpect(status().isNoContent());

    verify(competencyService).deleteCompetency(competencyDto.competencyId());
  }

  @Test
  void deleteCompetency_ShouldReturnBadRequestWhenIdInvalid() throws Exception {
    mockMvc.perform(delete("/api/competencies/abc"))
        .andExpect(status().isBadRequest());
    
    verifyNoInteractions(competencyService);
  }
  
  @Test
  void deleteCompetency_ShouldReturnNotFoundWhenCompetencyDoesNotExist() throws Exception {
    doThrow(new ResponseStatusException(HttpStatus.NOT_FOUND))
        .when(competencyService).deleteCompetency(competencyDto.competencyId());

    mockMvc.perform(delete("/api/competencies/{id}", competencyDto.competencyId()))
        .andExpect(status().isNotFound());

    verify(competencyService).deleteCompetency(competencyDto.competencyId());
  }

  @Test 
  void deleteCompetency_ShouldReturnConflictWhenCompetencyInUse() throws Exception {
    doThrow(new ResponseStatusException(HttpStatus.CONFLICT))
        .when(competencyService).deleteCompetency(competencyDto.competencyId());

    mockMvc.perform(delete("/api/competencies/{id}", competencyDto.competencyId()))
        .andExpect(status().isConflict());

    verify(competencyService).deleteCompetency(competencyDto.competencyId());
  }
}