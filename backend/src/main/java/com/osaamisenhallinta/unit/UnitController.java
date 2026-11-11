package com.osaamisenhallinta.unit;

import com.osaamisenhallinta.unit.dto.AtRiskItemDto;
import com.osaamisenhallinta.unit.dto.UnitOverviewDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/** REST controller for organizational unit operations. */
@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
@Tag(name = "Units", description = "Endpoints for unit management and risk tracking")
public class UnitController {

  private final UnitService unitService;

  @Operation(
      summary = "Get at-risk critical qualification items",
      description =
          "Retrieves all missing, expired, or expiring-soon competencies belonging "
              + "to critical qualifications for employees in the specified unit.")
  @ApiResponses(
      value = {
        @ApiResponse(
            responseCode = "200",
            description = "Successfully retrieved at-risk qualification items"),
        @ApiResponse(responseCode = "404", description = "Unit not found")
      })
  @GetMapping("/units/{unitId}/at-risk-critical-qualification-items")
  public List<AtRiskItemDto> getAtRiskCriticalQualificationItems(@PathVariable Long unitId) {
    return unitService.getAtRiskCriticalQualificationItems(unitId);
  }

  @Operation(
      summary = "Get unit overview",
      description = "Retrieves unit supervisors and employee list for the specified unit.")
  @ApiResponses(
      value = {
        @ApiResponse(responseCode = "200", description = "Successfully retrieved unit overview"),
        @ApiResponse(responseCode = "404", description = "Unit not found")
      })
  @GetMapping("/units/{unitId}/overview")
  public UnitOverviewDto getUnitOverview(@PathVariable Long unitId) {
    return unitService.getUnitOverview(unitId);
  }
}
