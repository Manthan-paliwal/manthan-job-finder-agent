from pypdf import PdfReader


def extract_text_from_pdf(file_path):

    reader = PdfReader(file_path)

    text = ""

    for page in reader.pages:

        extracted_text = page.extract_text()

        if extracted_text:
            text += extracted_text

    return text