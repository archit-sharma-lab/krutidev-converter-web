export async function handler(event) {
  try {
    const { text } = JSON.parse(event.body);

    const response = await fetch(
      `https://translation.googleapis.com/language/translate/v2?key=${process.env.GOOGLE_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          q: text,
          source: "en",
          target: "hi",
          format: "text"
        })
      }
    );

    const data = await response.json();

    if (!data?.data?.translations?.[0]?.translatedText) {
      throw new Error("Translation failed");
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        translated: data.data.translations[0].translatedText
      })
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Translation error" })
    };
  }
}
