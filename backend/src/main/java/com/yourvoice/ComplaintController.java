package com.yourvoice;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.Instant;
import java.util.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class ComplaintController {

  @PostMapping("/analyze")
  public Map<String, Object> analyze(@RequestBody Map<String, String> input) {
    String text = input.getOrDefault("text", "");
    String lower = text == null ? "" : text.toLowerCase(Locale.ENGLISH);
    Map<String, Object> result = new LinkedHashMap<>();

    if (lower.matches(".*(air|pollution|factory|smoke|धुआँ|धुआं|वायु|फैक्टरी).*")) {
      result.put("category", "Air pollution");
      result.put("department", "State Pollution Control Board");
      result.put("portal", "https://cpcb.nic.in/online-complaint/");
      result.put("reason", "Industrial emissions are regulated by pollution control authorities.");
    } else if (lower.matches(".*(garbage|trash|waste|kuda|कचरा|कूड़ा).*")) {
      result.put("category", "Garbage & waste");
      result.put("department", "Municipal Corporation / Nagar Palika");
      result.put("portal", "https://swachhbharatmission.gov.in/");
      result.put("reason", "Waste collection and public sanitation fall under local civic bodies.");
    } else if (lower.matches(".*(water|पानी|nali|drain|सीव|drainage).*")) {
      result.put("category", "Water & drainage");
      result.put("department", "Public Health Engineering / Jal Nigam");
      result.put("portal", "https://jalshakti-ddws.gov.in/");
      result.put("reason", "Water supply and drainage infrastructure are managed by local water authorities.");
    } else if (lower.matches(".*(road|pothole|gaddha|सड़क|गड्ढा).*")) {
      result.put("category", "Road damage");
      result.put("department", "Municipal Corporation / PWD");
      result.put("portal", "https://pgportal.gov.in/");
      result.put("reason", "Road maintenance is handled by the municipality or Public Works Department.");
    } else {
      result.put("category", "General civic issue");
      result.put("department", "District Magistrate / Municipal Corporation");
      result.put("portal", "https://pgportal.gov.in/");
      result.put("reason", "Your complaint will be routed through the general district grievance system.");
    }
    result.put("questions",
        List.of("Where exactly is the problem?", "How long has it been happening?", "Do you have photos or videos?"));
    result.put("aiMode", "Demo analysis — no API key required");
    return result;
  }

  @PostMapping("/submit")
  public ResponseEntity<Map<String, Object>> submit(@RequestBody Map<String, Object> complaint) {
    String reference = "YV" + Instant.now().toEpochMilli();
    Map<String, Object> response = new LinkedHashMap<>();
    response.put("reference", reference);
    response.put("status", "Prepared for submission");
    response.put("portal", complaint.getOrDefault("portal", "https://pgportal.gov.in/"));
    response.put("message", "Your complaint is ready. Complete it on the official portal.");
    return ResponseEntity.ok(response);
  }

  @GetMapping("/track/{reference}")
  public Map<String, Object> track(@PathVariable String reference) {
    Map<String, Object> response = new LinkedHashMap<>();
    response.put("reference", reference);
    response.put("status", "Under review");
    response.put("updated", "Demo status — official response may take time");
    return response;
  }
}
