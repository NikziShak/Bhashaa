# Local voice tutor model plan

## Recommended first stack

Use separate, downloadable on-device models for listening, tutoring, and speaking. Keeping the dialogue model small and specializing its prompt/fine-tuning makes a phone call tutor more practical than a single general speech model.

| Role | First candidate | Why it fits | License / notes |
|---|---|---|---|
| Conversation tutor | [Qwen3-0.6B-GGUF](https://huggingface.co/Qwen/Qwen3-0.6B-GGUF), Q4 quantization | 0.6B parameters, supports 100+ languages and multi-turn role-play; can use a short, constrained JSON turn format. Fine-tune with tutor dialogues for the call role. | Apache-2.0 per Hugging Face model card. Validate each quantized artifact and tokenizer/template before shipping. |
| Mobile LLM runtime | [llama.rn](https://github.com/mybigday/llama.rn) / llama.cpp | React Native binding for local GGUF inference on iOS and Android. Keep the model as an optional download rather than inflating the base APK/IPA. | Check package and llama.cpp license notices in the shipped app. |
| Indian-language speech recognition | [IndicConformer sherpa-onnx exports](https://huggingface.co/parismitaglobalsolutions/indicconformer-sherpa-onnx) | Per-language offline ASR for 22 scheduled Indian languages; choose the target-language model and optionally add English/Hinglish recognition. | The model card lists AI4Bharat source models as MIT; export and wrapper are separate artifacts with their own notices. Confirm the exact checkpoint and redistribution terms. |
| Hindi speech generation | [Indic Tiny TTS Hindi](https://huggingface.co/sulabhkatiyar/indic-tiny-tts-hindi) | Compact Hindi voice model, ONNX export, CPU inference, male/female voices; its card reports about 90 MB per format. | CC-BY-4.0 weights require attribution; vocoder is MIT. It reads Devanagari, not Latin-script Hinglish. |
| TTS runtime / VAD | [sherpa-onnx](https://github.com/k2-fsa/sherpa-onnx) | Offline Android/iOS speech runtime with VAD, ASR and TTS. | Apache-2.0 runtime; each model keeps its own license. |

For other target languages, select a matching ASR and TTS model from the same language-specific families. Do not assume one Hindi checkpoint handles all Indian languages. Start with Hindi + English/Hinglish, then add languages after native-speaker evaluation.

## Tutor specialization

The base LLM is not itself a speech recognizer and is not specifically trained as a language tutor. Use it as the local conversation brain, then specialize it with supervised conversation examples (scenario, learner level, learner utterance, natural reply, correction, translation, next prompt). A small LoRA fine-tune can teach short spoken turns, one follow-up at a time, gentle recasts instead of lectures, code-switch rescue, and age-appropriate role-play. Evaluate pronunciation separately with ASR/audio signals; never claim an accent or pronunciation diagnosis from text alone.

The first experiments should compare the unmodified Qwen3-0.6B prompt against a tutor LoRA and a larger 1.7B quantized option on entry-level Android phones. Measure first-audio latency, peak RAM, battery use, ASR word error by language/accent, correction quality, and turn naturalness before selecting the default. Q4 model files and speech models are downloaded after onboarding over Wi-Fi and stored in app-private storage; the app remains usable for scripted practice before downloads finish.

## Call agent loop

1. VAD detects the learner's turn ending; streaming ASR produces a partial transcript locally.
2. The local tutor receives learner level, selected target/support languages, the current role-play scene, and the last few turns.
3. The tutor returns a short spoken reply, optional translation, one gentle correction, and one next prompt in a structured response.
4. TTS starts as soon as the first clause is ready. The learner can interrupt, slow the voice, request a phrase hint, or switch to support-language explanation.
5. After the call, a separate learning planner stores phrases and speaking signals locally and picks the next real-life scenario. Do not store raw audio by default.

## App integration status

`src/ai/voiceTutor.ts` defines the tutor prompt and response contract. The current call screen is still a UI prototype; llama.cpp, microphone streaming, sherpa-onnx, model downloads, VAD and TTS are not yet connected. These native modules require development builds on both Android and iOS. Keep model binaries out of the Git repository and APK; download and verify pinned model files on first use.
