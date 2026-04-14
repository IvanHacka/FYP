package org.example.jobboard.dto;


import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class ApplyJobRequest {
    private Long jobId;
    private String whyGoodFit;
    private BigDecimal expectedSalary;
    private LocalDate availableStartDate;
}
