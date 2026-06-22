import {NextResponse} from "next/server";

export async function POST(request: Request) {
  try {
    const { image, country } = await request.json();

    if (!image || !country) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // 1. 국가별 유니폼 이미지 주소 생성
    const formattedCountry = country.toLowerCase().replace(/ /g, "-");
    const templateFileName = `${formattedCountry}.jpg`;
    const targetImageUrl = `https://raw.githubusercontent.com/micka-s-small-project/soccer/refs/heads/main/public/templates/soccer/${templateFileName}`;

    console.log("📸 [Backend] Base64 데이터를 Imgbb 시한부 링크로 변환 중...");

    // Base64 문자열에서 순수 데이터 파트만 분리 (data:image/png;base64, 제거)
    const base64RawData = image.split(",")[1];

    const formData = new FormData();
    formData.append("image", base64RawData);

    const imgbbApiKey = process.env.IMGBB_API_KEY;
    if (!imgbbApiKey) {
      throw new Error("환경 변수에 IMGBB_API_KEY가 세팅되지 않았습니다.");
    }

    // 💡 주소 뒤에 &expiration=600 을 붙여서 "10분(600초) 뒤 자동 파괴" 스케줄링을 겁니다.
    const imgbbResponse = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbApiKey}&expiration=600`, {
      method: "POST",
      body: formData,
    });

    if (!imgbbResponse.ok) {
      const imgbbErr = await imgbbResponse.text();
      console.error("❌ Imgbb 업로드 실패 원인:", imgbbErr);
      throw new Error("임시 이미지 서버 호스팅에 실패했습니다.");
    }

    const imgbbData = await imgbbResponse.json();
    const userSecureImageUrl = imgbbData.data.url; // 🎉 10분 뒤 자동 삭제될 유저 고유 https 주소!
    console.log("🔗 임시 보관된 유저 이미지 주소:", userSecureImageUrl);
    // ========================================================

    // 2. 🎰 50% 확률로 두 가지 프롬프트 중 하나를 랜덤 선택
    const isGoalScenario = Math.random() < 0.5;
    let finalPrompt = "";

    if (isGoalScenario) {
      finalPrompt = `An authentic, realistic sports broadcast screenshot-style documentary photo of the specific individual from the attached reference image, sitting in the spectator stands of a professional football stadium during a peak match moment.

[Subject Integration & Realism]
The individual from the reference image is captured from the chest up, mid-reaction with a raw, emotionally immersed expression of sudden celebration. The person has eyes wide with a mix of disbelief and intense euphoria, naturally looking toward the pitch or celebrating crowd, NOT looking directly into the camera. The person maintains their exact facial structure, jawline, and natural features from the reference image. Any headwear like beanies or hats from the reference image is removed, revealing a natural hairstyle that seamlessly blends with the stadium environment and fits the person's biological gender.

[Clothing Details]
The person is wearing the exact official football jersey from the attached uniform image, with the jersey fit tailored naturally to the individual's body shape and proportions.

[Environment & Atmosphere]
Set in the crowded stands immediately after a crucial goal is scored. Candid live broadcast moment with realistic football TV broadcast camera framing, telephoto sports lens look with slight broadcast zoom compression. Shallow depth of field with background fans blurred in motion, throwing their arms up in celebration under authentic stadium floodlights.

[Cinematic & Broadcast Quality]
Minimal football broadcast overlay graphics showing an updated scoreline at the corner, a subtle LIVE watermark, documentary realism, realistic skin texture under stadium lighting, explosive crowd atmosphere, 16:9 ratio.`;
    } else {
      finalPrompt = `An authentic, realistic sports broadcast screenshot-style documentary photo of the specific individual from the attached reference image, sitting in the spectator stands of a professional football stadium during a live match.

[Subject Integration & Realism]
The individual from the reference image is captured from the chest up, sitting naturally in the stadium seats. The person has delicate facial features and a neutral yet emotionally immersed expression, fully focused on the game. The person is naturally looking toward the football field or slightly off-camera, NOT looking directly into the camera. The person maintains their exact facial structure, jawline, and natural features from the reference image. Any headwear like beanies or hats from the reference image is removed, revealing a natural hairstyle that seamlessly blends with the stadium environment and fits the person's biological gender.

[Clothing Details]
The person is wearing the exact official football jersey from the attached uniform image, with the jersey fit tailored naturally to the individual's body shape and proportions.

[Environment & Atmosphere]
Set in the crowded spectator stands among diverse football fans during an intense live match. Candid live broadcast moment with a realistic crowd atmosphere under authentic, bright stadium floodlights. 

[Cinematic & Broadcast Quality]
Captured with a telephoto sports lens look, showcasing slight broadcast zoom compression and a shallow depth of field with background fans subtly blurred. Minimal football broadcast overlay graphics showing match info or time at the corner, a subtle LIVE watermark, documentary realism, realistic skin texture under stadium lighting, 16:9 ratio.`;
    }

    console.log(`🚀 [Backend] Triggering official openai/gpt-image-2 endpoint...`);

    // 3. 🔥 [핵심 고친 점] 공식 curl 사양에 맞춰 수정한 직접 호출 파이프라인
    const replicateResponse = await fetch("https://api.replicate.com/v1/models/openai/gpt-image-2/predictions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.REPLICATE_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        input: {
          prompt: finalPrompt,
          aspect_ratio: "16:9",
          output_format: "webp",
          number_of_images: 1,
          output_compression: 90,
          input_images: [
            userSecureImageUrl,
            targetImageUrl
          ]
        }
      })
    });

    // 4. 응답 예외 처리
    if (!replicateResponse.ok) {
      const errorText = await replicateResponse.text();
      console.error("❌ Replicate API 직접 호출 에러 응답:", errorText);
      throw new Error(`Replicate API status ${replicateResponse.status}: ${errorText}`);
    }

    const prediction = await replicateResponse.json();
    console.log(`📥 Ticket Created! Prediction ID: ${prediction.id}`);

    // 프론트엔드에게 작업 티켓 번호만 던지고 즉시 커넥션을 해제합니다 (0.5초 소요).
    return NextResponse.json({ predictionId: prediction.id });

  } catch (error: any) {
    console.error("💥 [Backend] Operation Failed:", error);

    // 🛡️ 크레딧 방전 및 연동 실패 시 점검 시그널을 던져 결제 버튼 잠금
    const errMsg = error.message || "";
    if (
        errMsg.includes("credit") ||
        errMsg.includes("balance") ||
        errMsg.includes("fund") ||
        errMsg.includes("failed") ||
        errMsg.includes("422")
    ) {
      return NextResponse.json(
          {error: "SYSTEM_MAINTENANCE: The Jumbotron is currently recharging. 🎫⚽"},
          { status: 422 }
      );
    }

    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const {searchParams} = new URL(request.url);
  const predictionId = searchParams.get("id");

  if (!predictionId) {
    return NextResponse.json({error: "Missing prediction id"}, {status: 400});
  }

  try {
    const res = await fetch(`https://api.replicate.com/v1/predictions/${predictionId}`, {
      headers: {
        "Authorization": `Bearer ${process.env.REPLICATE_API_TOKEN}`,
      },
    });

    if (!res.ok) throw new Error(`Replicate status check failed: ${res.status}`);

    const prediction = await res.json();

    if (prediction.status === "failed") {
      console.error("==================================================");
      console.error(`🚨 [Replicate AI 내부 에러 발생] ID: ${predictionId}`);
      console.error(`📄 에러 메시지 원본:`, prediction.error);
      console.error("==================================================");
    }

    return NextResponse.json({
      status: prediction.status,
      output: prediction.output,
    });
  } catch (error: any) {
    console.error("💥 [Backend] GET Failed:", error);
    return NextResponse.json({error: error.message}, {status: 500});
  }
}