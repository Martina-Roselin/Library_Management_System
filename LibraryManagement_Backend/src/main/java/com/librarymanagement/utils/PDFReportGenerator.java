package com.librarymanagement.utils;

import com.itextpdf.text.*;
import com.itextpdf.text.pdf.PdfWriter;
import com.librarymanagement.model.IssueRecord;
import org.springframework.stereotype.Component;

import java.io.ByteArrayOutputStream;
import java.util.List;

@Component
public class PDFReportGenerator {

    public byte[] generateIssuanceReport(List<IssueRecord> records) throws DocumentException {
        Document document = new Document();
        ByteArrayOutputStream out = new ByteArrayOutputStream();

        PdfWriter.getInstance(document, out);
        document.open();

        Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18);
        Paragraph title = new Paragraph("Library Issuance Report", titleFont);
        title.setAlignment(Element.ALIGN_CENTER);
        document.add(title);
        document.add(Chunk.NEWLINE);

        for (IssueRecord record : records) {
            document.add(new Paragraph(String.format(
                "Book: %s\nUser: %s\nIssue Date: %s\nDue Date: %s\nReturn Date: %s\n",
                record.getBook().getTitle(),
                record.getUser().getName(),
                record.getIssueDate(),
                record.getDueDate(),
                record.getReturnDate()
            )));
            document.add(Chunk.NEWLINE);
        }

        document.close();
        return out.toByteArray();
    }
}