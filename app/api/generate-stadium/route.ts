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

    const formattedCountry = country.toLowerCase().replace(/ /g, "-");
    const randomNumber = Math.random() < 0.5 ? 1 : 2;
    const templateFileName = `${formattedCountry}-${randomNumber}.png`;

    const targetImageUrl = `https://raw.githubusercontent.com/micka-s-small-project/soccer/refs/heads/main/public/templates/${formattedCountry}/${templateFileName}`;

    console.log(`🚀 [1/3] Triggering Face Swap Prediction...`);

    // 1. 비동기 예측(Prediction) 객체 생성
    let prediction = await replicate.predictions.create({
      version: "d1d6ea8c8be89d664a07a457526f7128109dee7030fdac424788d762c71ed111",
      input: {
        input_image: targetImageUrl,
        swap_image: image,
      },
    });

    console.log(`⏳ [2/3] Prediction created (ID: ${prediction.id}). Waiting for AI to finish...`);

    // 2. 🔥 [고친 점] while 폴링 대신 공식 .wait() 메소드를 사용해 완벽히 대기합니다.
    // AI 처리가 100% 끝나고 output 결과물이 JSON에 채워질 때까지 안전하게 block됩니다.
    prediction = await replicate.wait(prediction);

    // 3. 에러 상태인 경우 분기 차단
    if (prediction.status === "failed") {
      console.error("🚨 Replicate Prediction Internal Failure:", prediction.error);
      throw new Error(`AI generation failed: ${prediction.error}`);
    }

    // 4. 🎉 성공 상태일 때 결과 뽑아내기
    const output = prediction.output;
    console.log("📥 [Backend] Synced Raw Replicate Output:", JSON.stringify(output, null, 2));

    if (!output) {
      throw new Error("AI successfully processed but returned empty output data.");
    }

    let resultImageUrl = "";

    // 공식 문서대로 단일 문자열 포맷이 오거나, 예외적인 배열 형태가 와도 모두 소화하는 안전장치
    if (Array.isArray(output)) {
      resultImageUrl = output[0]?.toString() || "";
    } else if (typeof output === "object" && output && "url" in output) {
      resultImageUrl = (output as any).url.toString();
    } else {
      resultImageUrl = output.toString();
    }

    if (!resultImageUrl || !resultImageUrl.startsWith("http")) {
      throw new Error("Failed to extract a valid image URL from AI output.");
    }

    console.log(`✨ [3/3] Face Swap Complete! Result URL: ${resultImageUrl}`);

    return NextResponse.json({ resultUrl: resultImageUrl });

  } catch (error: any) {
    console.error("💥 [Backend] Execution Failed!");

    if (error.response) {
      try {
        const errorBody = await error.response.clone().text();
        console.error("📋 Replicate Response Status:", error.response.status);
        console.error("📄 Replicate Error Detail:", errorBody);
      } catch (cloneError) {
        console.error("📝 Message:", error.message);
      }
    } else {
      console.error("📝 Error Message:", error.message || error);
    }

    const friendlyError = error.message || "Internal Server Error during Face Swap";
    return NextResponse.json({ error: friendlyError }, { status: 500 });
  }
}