def chunk_text(text_list, chunk_size=300):
    chunks = []

    for text in text_list:
        for i in range(0, len(text), chunk_size):
            chunks.append(text[i:i + chunk_size])

    return chunks