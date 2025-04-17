export async function extractTextFromDoc(docData) {
    try {
      // Convert base64 data to array buffer if needed
      let data = docData;
      if (typeof docData === 'string' && 
          (docData.startsWith('data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,') ||
           docData.startsWith('data:application/msword;base64,'))) {
        const base64 = docData.replace(/^data:application\/[^;]+;base64,/, '');
        const binary = atob(base64);
        const len = binary.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
          bytes[i] = binary.charCodeAt(i);
        }
        data = bytes.buffer;
      }
  
      console.log("Processing DOC/DOCX document...");
      
      // Since mammoth might be causing issues, let's implement a fallback
      try {
        // Try using mammoth if available
        const mammoth = await import('mammoth');
        const result = await mammoth.extractRawText({ arrayBuffer: data });
        console.log("DOC/DOCX extraction complete using mammoth");
        return result.value;
      } catch (mammothError) {
        console.warn("Mammoth failed, using fallback method:", mammothError);
        
        // Fallback: If we can't process the document properly, at least try to extract some meaningful text
        // This is a simplified approach that won't work well but is better than nothing
        const textDecoder = new TextDecoder('utf-8');
        let text = textDecoder.decode(new Uint8Array(data));
        
        // Try to clean up the text by removing non-printable characters
        text = text.replace(/[^\x20-\x7E\x0A\x0D]/g, ' ')
                   .replace(/\s+/g, ' ')
                   .trim();
        
        return text;
      }
    } catch (error) {
      console.error('Error extracting text from DOC/DOCX:', error);
      throw new Error(`Failed to extract text from DOC/DOCX: ${error.message}`);
    }
  }