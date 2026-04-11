package org.example.jobboard.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;


@Data
@AllArgsConstructor
public class MatchScoreBreakdownRequest {
    private BigDecimal finalScore;
    private BigDecimal skillScore;
    private BigDecimal salaryScore;
    private BigDecimal locationScore;
    private BigDecimal titleScore;
    private BigDecimal jobTypeScore;

}
