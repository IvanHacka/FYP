package org.example.jobboard.dto;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DocumentResponse {
    private Long documentId;
    private String documentName;
    private String documentType;
    private String filePath;
}
