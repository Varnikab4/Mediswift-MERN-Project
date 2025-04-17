export function analyzeReportLocally(text) {
    console.log("Received Report Text:", text);
    
    // Predefined normal ranges for health parameters
    const normalRanges = {
      "heart rate": { min: 60, max: 100, unit: "bpm" },
      "blood pressure": { min: 90, max: 120, unit: "mmHg" },
      "systolic": { min: 90, max: 120, unit: "mmHg" },
      "diastolic": { min: 60, max: 80, unit: "mmHg" },
      "pulse": { min: 60, max: 100, unit: "bpm" },
      "respiratory rate": { min: 12, max: 20, unit: "breaths/min" },
      "oxygen saturation": { min: 95, max: 100, unit: "%" },
      "temperature": { min: 97, max: 99, unit: "°F" },
      "hemoglobin": { min: 12, max: 16, unit: "g/dL" },
      "hgb": { min: 12, max: 16, unit: "g/dL" },
      "vitamin d": { min: 20, max: 50, unit: "ng/mL" },
      "vitamin b12": { min: 200, max: 900, unit: "pg/mL" },
      "glucose": { min: 70, max: 100, unit: "mg/dL" },
      "cholesterol": { min: 0, max: 200, unit: "mg/dL" },
      "hdl": { min: 40, max: 60, unit: "mg/dL" },
      "ldl": { min: 0, max: 100, unit: "mg/dL" },
      "triglycerides": { min: 0, max: 150, unit: "mg/dL" },
      "a1c": { min: 4, max: 5.7, unit: "%" },
      "bmi": { min: 18.5, max: 24.9, unit: "" },
      "creatinine": { min: 0.6, max: 1.2, unit: "mg/dL" },
      "wbc": { min: 4.5, max: 11.0, unit: "10^3/μL" },
      "rbc": { min: 4.5, max: 5.9, unit: "10^6/μL" },
      "platelet": { min: 150, max: 450, unit: "10^3/μL" },
    };
  
    // Expanded regex patterns for patient details
    const patientDetailsRegex = {
      name: /(?:patient name|name)[:\s]*([A-Za-z\s.'-]+)/i,
      age: /(?:age|years old)[:\s]+(\d+)/i,
      dob: /(?:DOB|Date of Birth|Birth Date|D.O.B)[:\s]*(\d{1,2}(?:st|nd|rd|th)?\s+[A-Za-z]+\s+\d{4}|\d{1,2}[-/]\d{1,2}[-/]\d{2,4}|\d{4}[-/]\d{1,2}[-/]\d{1,2})/i,
      gender: /(?:gender|sex)[:\s]+(male|female|m|f|other)/i,
      hospital: /(?:hospital|facility|center|clinic)[\s:,-]*(?:\*\*)?([\w&.\-' ]{2,80})/i,
      mrn: /(?:mrn|medical record|record number)[:\s]+([\w\d-]+)/i,
      consultingDoctor: /(?:consulting doctor|consultant|doctor)[:\s]*(?:Dr\.\s*)?([A-Z][a-z]+\s+[A-Z][a-z]+)/i

    };
  
    let patientInfo = {};
    for (const key in patientDetailsRegex) {
      const match = text.match(patientDetailsRegex[key]);
      if (match) {
        patientInfo[key] = match[1].trim();
      }
    }
  
    // Multiple regex patterns to catch different formats
    const regexPatterns = [
      // Standard format: "Parameter: Value Unit"
      /[-•*]?\s*([A-Za-z\s()]+?)[:\-=]+\s*(\d+(?:\.\d+)?(?:\/\d+(?:\.\d+)?)?)\s*([a-zA-Z%°\/]+)/gi,
      
      // Format: "Parameter Value Unit"
      /[-•*]?\s*([A-Za-z\s()]+?)\s+(\d+(?:\.\d+)?(?:\/\d+(?:\.\d+)?)?)\s*([a-zA-Z%°\/]+)/gi,
      
      // Format with brackets: "Parameter [Value Unit]"
      /([A-Za-z\s()]+?)\s*\[\s*(\d+(?:\.\d+)?(?:\/\d+(?:\.\d+)?)?)\s*([a-zA-Z%°\/]+)\s*\]/gi,
      
      // Format with parentheses: "Parameter (Value Unit)"
      /([A-Za-z\s()]+?)\s*\(\s*(\d+(?:\.\d+)?(?:\/\d+(?:\.\d+)?)?)\s*([a-zA-Z%°\/]+)\s*\)/gi,
      
      // Format with equal sign: "Parameter = Value Unit"
      /([A-Za-z\s()]+?)\s*=\s*(\d+(?:\.\d+)?(?:\/\d+(?:\.\d+)?)?)\s*([a-zA-Z%°\/]+)/gi,
      
      // Blood pressure specific pattern: "BP: Systolic/Diastolic mmHg"
      /(?:blood pressure|bp)[:\s]+(\d+)\/(\d+)\s*([a-zA-Z%°\/]+)/gi
    ];
  
    let findings = [];
    let abnormalFindings = [];
    let recommendations = [];
    
    // Process each regex pattern
    regexPatterns.forEach(regex => {
      let match;
      let textCopy = text; // Create a copy because regex is stateful
      
      while ((match = regex.exec(textCopy)) !== null) {
        // For blood pressure specific pattern
        if (regex.toString().includes('blood pressure|bp')) {
          const systolic = match[1];
          const diastolic = match[2];
          const unit = match[3].trim() || "mmHg";
          
          findings.push(`Blood Pressure: ${systolic}/${diastolic} ${unit}`);
          
          // Check systolic
          if (normalRanges["systolic"]) {
            const numSystolic = parseFloat(systolic);
            if (numSystolic < normalRanges["systolic"].min || numSystolic > normalRanges["systolic"].max) {
              abnormalFindings.push(`Systolic Blood Pressure is out of range: ${systolic} ${unit}`);
              recommendations.push(`Consult a doctor regarding **Blood Pressure**.`);
            }
          }
          
          // Check diastolic
          if (normalRanges["diastolic"]) {
            const numDiastolic = parseFloat(diastolic);
            if (numDiastolic < normalRanges["diastolic"].min || numDiastolic > normalRanges["diastolic"].max) {
              abnormalFindings.push(`Diastolic Blood Pressure is out of range: ${diastolic} ${unit}`);
              if (!recommendations.includes(`Consult a doctor regarding **Blood Pressure**.`)) {
                recommendations.push(`Consult a doctor regarding **Blood Pressure**.`);
              }
            }
          }
          
          continue;
        }
        
        // For standard patterns
        let param = match[1].toLowerCase().trim();
        let value = match[2];
        let unit = match[3] ? match[3].trim() : "";
        
        // Special case handling for common abbreviations and synonyms
        const paramMappings = {
          "hr": "heart rate",
          "pulse": "heart rate",
          "bp": "blood pressure",
          "rr": "respiratory rate",
          "temp": "temperature",
          "o2 sat": "oxygen saturation",
          "spo2": "oxygen saturation",
          "hgb": "hemoglobin",
          "vit d": "vitamin d",
          "vit b12": "vitamin b12"
        };
        
        // Map abbreviations to full parameter names
        if (paramMappings[param]) {
          param = paramMappings[param];
        }
        
        console.log(`Detected Parameter: ${match[1]} - Value: ${value} ${unit}`);
        
        findings.push(`${match[1]}: ${value} ${unit}`);
        
        // Check if parameter exists in normal ranges
        if (normalRanges[param]) {
          const { min, max, unit: expectedUnit } = normalRanges[param];
          
          // Unit might be different but still valid (e.g., C vs F for temperature)
          let numericValue = parseFloat(value.split("/")[0]);
          
          // Handle unit conversion if needed
          if (param === "temperature" && unit.toLowerCase().includes("c") && expectedUnit.includes("F")) {
            // Convert Celsius to Fahrenheit
            numericValue = (numericValue * 9/5) + 32;
            unit = "°F";
          }
          
          if (numericValue < min || numericValue > max) {
            abnormalFindings.push(`${match[1]} is out of range: ${value} ${unit}`);
            recommendations.push(`Consult a doctor regarding **${match[1]}**.`);
          }
        }
      }
    });
    
    // Remove duplicate findings
    findings = [...new Set(findings)];
    abnormalFindings = [...new Set(abnormalFindings)];
    recommendations = [...new Set(recommendations)];
  
    // Generate the final report summary
    let report = `Summary Of Report\n\n`;
    
    if (Object.keys(patientInfo).length > 0) {
      report += `Patient Details:-\n`;
      if (patientInfo.name) report += `- Name: ${patientInfo.name}\n`;
      if (patientInfo.age) report += `- Age: ${patientInfo.age}\n`;
      if (patientInfo.dob) report += `- DOB: ${patientInfo.dob}\n`;
      if (patientInfo.gender) report += `- Gender: ${patientInfo.gender}\n`;
      if (patientInfo.hospital) report += `- Hospital Name: ${patientInfo.hospital}\n`;
      if (patientInfo.mrn) report += `- MRN: ${patientInfo.mrn}\n`;
      if (patientInfo.consultingDoctor) report += `- Consulting Doctor: Dr. ${patientInfo.consultingDoctor}\n`;
      report += `\n`;
    }
    
    report += `Key Health Parameters:-\n`;
    report += findings.length > 0 ? findings.map(f => `- ${f}`).join("\n") : "- No specific health parameters detected.\n";
    
    report += `\n\nAbnormal Findings:-\n`;
    report += abnormalFindings.length > 0 ? abnormalFindings.map(f => `- ${f}`).join("\n") : "- No abnormal results detected.\n";
    
    report += `\n\nRecommendations:-\n`;
    report += recommendations.length > 0 ? recommendations.map(r => `- ${r}`).join("\n") : "- No specific recommendations mentioned.\n";
    report += `- Consider consulting your doctor for further interpretation.\n`;
    
    report += `\n\nNote: This is an automated analysis. Please consult a medical professional for accurate interpretation.`;
    
    return report;
  }