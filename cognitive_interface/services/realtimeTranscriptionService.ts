// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/cognitive_interface/services/realtimeTranscriptionService.ts
================================================================================

```typescript
import { Configuration, OpenAIApi } from "openai";
import { SpeechClient } from "@google-cloud/speech"; // Import Google Cloud Speech-to-Text client
import { Readable } from 'stream';


// Define an interface for transcription results
interface TranscriptionResult {
    text: string;
    isFinal: boolean;
    confidence?: number; // Optional confidence score
}


// Define configuration for OpenAI API (if using as a fallback or for post-processing)
interface GeminiApiResponse {
  candidates: {
    content: {
      parts: {
        text: string;
      }[];
    };
  }[];
}

interface OpenAIConfig {
    apiKey?: string;
    model?: string;
    geminiApiKey?: string;
}

const DEFAULT_OPENAI_MODEL = "gpt-3.5-turbo";


export class RealtimeTranscriptionService {
    private openai: OpenAIApi | null = null;
    private googleSpeechClient: SpeechClient | null = null;
    private apiKey: string | undefined;
    private geminiApiKey: string | undefined;
    private openAIModel: string; // Model to use for OpenAI
    private useGemini: boolean;


    constructor(config: OpenAIConfig = {}) {
      this.apiKey = config.apiKey;
      this.geminiApiKey = config.geminiApiKey;
      this.openAIModel = config.model || DEFAULT_OPENAI_MODEL;
      this.useGemini = !!this.geminiApiKey; // Use Gemini if API key is provided

      if (this.apiKey) {
          const configuration = new Configuration({
              apiKey: this.apiKey,
          });
          this.openai = new OpenAIApi(configuration);
      }


        try {
            this.googleSpeechClient = new SpeechClient();
        } catch (error) {
            console.error("Failed to initialize Google Speech-to-Text client.  Ensure GOOGLE_APPLICATION_CREDENTIALS is set:", error);
        }
    }


    // Method to transcribe audio from a stream using Google Cloud Speech-to-Text
    async transcribeGoogleCloud(audioStream: Readable, encoding: 'LINEAR16' | 'MP3' = 'LINEAR16', sampleRateHertz: number = 16000): Promise<TranscriptionResult> {
        if (!this.googleSpeechClient) {
            throw new Error("Google Cloud Speech-to-Text client not initialized. Ensure GOOGLE_APPLICATION_CREDENTIALS is set.");
        }

        const request = {
            config: {
                encoding: encoding, // Adjust based on your audio format
                sampleRateHertz: sampleRateHertz, // Adjust based on your audio
                languageCode: "en-US", // Or your desired language
                model: 'default' // Or 'command_and_search', 'phone_call', 'video' or 'default'
            },
            interimResults: true, // Get real-time updates
        };


        const recognizeStream = this.googleSpeechClient
            .streamingRecognize(request)
            .then(responses => {
                const stream = responses[0];

                return new Promise<TranscriptionResult[]>((resolve, reject) => {
                    const results: TranscriptionResult[] = [];
                    stream.on('data', (data: any) => {
                        const result = data.results[0];
                        if (result && result.alternatives[0]) {
                            results.push({
                                text: result.alternatives[0].transcript,
                                isFinal: result.isFinal,
                                confidence: result.alternatives[0].confidence,
                            });
                        }
                    });

                    stream.on('error', (err: any) => {
                        console.error('Transcription Stream Error:', err);
                        reject(err);
                    });

                    stream.on('end', () => {
                        resolve(results);
                    });
                });
            });



        audioStream.on('error', (err) => {
          console.error('Audio Stream Error:', err);
          recognizeStream.catch(e => console.error("Error during recognition:", e))
        });

        audioStream.pipe(recognizeStream.then(stream => stream[0]))

        const results = await recognizeStream
        if (!results) {
          return {text: '', isFinal: true}
        }
        return results

    }



    // Method to transcribe audio from a stream using OpenAI (as a fallback or for post-processing)
    async transcribeOpenAI(audioStream: Readable, prompt?: string): Promise<TranscriptionResult> {
      if (!this.openai || !this.apiKey) {
          throw new Error("OpenAI API not initialized. Provide an API key.");
      }

      try {
        const params: any = {
          file: audioStream,
          model: this.openAIModel,
        };

        if (prompt) {
          params.prompt = prompt;
        }


        const response = await this.openai.createTranscription(
          audioStream as any, // Cast to any to bypass type checking as needed by OpenAI library
          this.openAIModel,
          undefined, // prompt: prompt,
          'json' // response_format: 'json',
        );

        if (response.data.text) {
          return {
              text: response.data.text,
              isFinal: true, // Assuming OpenAI returns final results
          };
        } else {
            return { text: "", isFinal: true }; // Handle no text
        }

      } catch (error: any) {
          console.error("OpenAI Transcription Error:", error);

          if (error.response) {
            console.error(error.response.status);
            console.error(error.response.data);
          } else {
            console.error(error.message);
          }

          throw new Error(`OpenAI Transcription failed: ${error.message}`);
      }
    }


    // Method to transcribe audio using Gemini
    async transcribeGemini(audioStream: Readable, prompt?: string): Promise<TranscriptionResult> {
      if (!this.geminiApiKey) {
        throw new Error("Gemini API not initialized. Provide a Gemini API key.");
      }

      try {

          const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:streamGenerateContent?key=${this.geminiApiKey}`;


          const audioBuffer = await this.streamToBuffer(audioStream);
          const base64Audio = audioBuffer.toString('base64');


          const requestBody = {
            contents: [
              {
                parts: [
                  {
                    mimeType: 'audio/mp3', // Or the appropriate MIME type
                    data: base64Audio,
                  },
                  {
                    text: prompt || "Transcribe the audio.", // Include prompt if available
                  },
                ],
              },
            ],
            generationConfig: {
              // Optional: Configure generation (e.g., temperature)
            },
          };


          const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
          });



          if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(`Gemini API request failed: ${response.status} - ${errorBody}`);
          }

          let fullText = "";

          const reader = response.body?.getReader();

          if (!reader) {
            throw new Error('Could not retrieve reader from response body.');
          }

          while (true) {
            const { done, value } = await reader.read();

            if (done) {
              break;
            }

            const decoder = new TextDecoder();
            const chunk = decoder.decode(value);

            // Attempt to parse the JSON chunk
            try {
              const jsonChunks = chunk.split('\n'); // Split by newline for stream chunks
              for (const jsonChunk of jsonChunks) {
                if (jsonChunk.trim() !== "") { // Avoid empty strings
                  const json = JSON.parse(jsonChunk); // Attempt to parse
                  if (json.candidates && json.candidates.length > 0) {
                    const text = json.candidates[0].content.parts[0]?.text; // Extract the text
                    if (text) {
                      fullText += text; // Append to full text
                    }
                  }
                }
              }
            } catch (parseError) {
              console.warn("Could not parse chunk:", chunk, parseError);
            }
          }

          return { text: fullText, isFinal: true };
      } catch (error: any) {
          console.error("Gemini Transcription Error:", error);

          if (error.response) {
            console.error(error.response.status);
            console.error(error.response.data);
          } else {
            console.error(error.message);
          }

          throw new Error(`Gemini Transcription failed: ${error.message}`);
      }
    }


    // Utility function to convert a Readable stream to a Buffer
    private async streamToBuffer(stream: Readable): Promise<Buffer> {
      return new Promise((resolve, reject) => {
        const chunks: Buffer[] = [];
        stream.on('data', (chunk) => chunks.push(chunk));
        stream.on('error', reject);
        stream.on('end', () => resolve(Buffer.concat(chunks)));
      });
    }



    // Main transcription method, decides which service to use
    async transcribe(audioStream: Readable, options: { prompt?: string,  encoding?: 'LINEAR16' | 'MP3', sampleRateHertz?: number} = {}): Promise<TranscriptionResult> {
      try {
        if (this.googleSpeechClient) {
          console.log("Transcribing using Google Cloud Speech-to-Text");
          return await this.transcribeGoogleCloud(audioStream, options.encoding, options.sampleRateHertz);
        } else if (this.useGemini) {
          console.log("Transcribing using Gemini API");
          return await this.transcribeGemini(audioStream, options.prompt);
        } else if (this.openai && this.apiKey) {
          console.log("Transcribing using OpenAI");
          return await this.transcribeOpenAI(audioStream, options.prompt);
        } else {
          throw new Error("No transcription service configured. Provide either Google Cloud credentials, an OpenAI API key, or a Gemini API key.");
        }
      } catch (error) {
        console.error("Transcription Error in main transcribe method:", error);
        throw error; // Re-throw the error for the calling function to handle
      }
    }


}
```