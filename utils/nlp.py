import spacy

nlp = spacy.load("en_core_web_sm")

def extract_tags(text, required_skills):
    doc = nlp(text.lower())
    found_skills = []

    for token in doc:
        if token.text in required_skills:
            found_skills.append(token.text)

    matched = list(set(found_skills))
    score = round((len(matched) / len(required_skills)) * 100, 2) if required_skills else 0
    return matched, score
