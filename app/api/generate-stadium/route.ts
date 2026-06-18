import { NextResponse } from "next/server";
import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function POST(request: Request) {
  try {
    const { image, country } = await request.json();

    if (!image || !country) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // 1. 국가별 유니폼 이미지 주소 생성
    const formattedCountry = country.toLowerCase().replace(/ /g, "-");
    const randomNumber = Math.random() < 0.5 ? 1 : 2;
    const templateFileName = `${formattedCountry}.png`;
    const targetImageUrl = `https://raw.githubusercontent.com/micka-s-small-project/soccer/refs/heads/main/public/templates/soccer/${formattedCountry}/${templateFileName}`;

    // 2. 🎰 50% 확률로 두 가지 프롬프트 중 하나를 랜덤 선택하여 다양성 부여
    const isGoalScenario = Math.random() < 0.5;
    let finalPrompt = "";

    if (isGoalScenario) {
      // 🔥 버전 A: 골 세레머니 (Euphoria)
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
      // ⚽ 버전 B: 라이브 경기 몰입 (Neutral)
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

    console.log(`🚀 [Backend] Triggering openai/gpt-image-2 Model...`);

    // 3. 🔥 openai/gpt-image-2 규격에 맞게 파라미터 매핑 및 API 호출
    // (replicate.wait를 빼고 0.5초 만에 응답을 뱉어 프론트 타임아웃을 차단합니다.)
    const prediction = await replicate.predictions.create({
      // openai/gpt-image-2 모델의 고유 해시 ID
      version: "d1d6ea8c8be89d664a07a457526f7128109dee7030fdac424788d762c71ed111",
      input: {
        prompt: finalPrompt,             // 📝 우리가 고도화한 프롬프트 주입
        image: image,                     // 👤 유저가 업로드한 셀카 이미지
        mask_image: targetImageUrl,       // 👕 깃허브에 저장된 국가별 유니폼 이미지
        // 💡 만약 모델이 mask_image 대신 second_image나 다른 필드명을 쓴다면 공식문서 스펙에 맞춰 이름만 바꿔주세요.
      },
    });

    console.log(`📥 Ticket Created! Prediction ID: ${prediction.id}`);

    // 프론트엔드에게 작업 티켓 번호만 던지고 즉시 커넥션을 해제합니다.
    return NextResponse.json({ predictionId: prediction.id });

  } catch (error: any) {
    console.error("💥 [Backend] Generation Request Failed!");

    // 🛡️ 크레딧 부족 시 $0.99 결제 버튼을 잠그기 위한 점검 모드 가드 작동
    const errMsg = error.message || "";
    if (
        errMsg.includes("credit") ||
        errMsg.includes("balance") ||
        errMsg.includes("fund") ||
        errMsg.includes("failed")
    ) {
      return NextResponse.json(
          { error: "SYSTEM_MAINTENANCE: The Jumbotron is recharging. 🎫⚽" },
          { status: 422 }
      );
    }

    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}