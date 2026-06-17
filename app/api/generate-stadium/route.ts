import { NextResponse } from "next/server";
import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

// 🚨 본인의 GitHub 유저명과 저장소(Repository) 이름을 적어주세요.
// 예: https://github.com/micka/soccer 라면 아래와 같이 세팅합니다.
const GITHUB_USERNAME = "yellTa";
const GITHUB_REPO = "soccer";

export async function POST(request: Request) {
  try {
    const { image, country } = await request.json();

    if (!image || !country) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const formattedCountry = country.toLowerCase().replace(/ /g, "-");
    const randomNumber = Math.random() < 0.5 ? 1 : 2;
    const templateFileName = `${formattedCountry}-${randomNumber}.png`;

    // 💡 [핵심] 깃허브 메인 브랜치에 올라간 public 폴더 내부의 이미지 절대 경로를 생성합니다.
    // 이렇게 하면 Replicate 구글 서버가 깃허브 인터넷 주소를 통해 내 유니폼 템플릿을 아주 가볍고 빠르게 다운로드해 갑니다.
    const targetImageUrl = `https://raw.githubusercontent.com/${GITHUB_USERNAME}/${GITHUB_REPO}/main/public/templates/${formattedCountry}/${templateFileName}`;

    console.log(`🚀 Requesting Face Swap with Template URL: ${targetImageUrl}`);

    const output = await replicate.run(
        "cdingram/face-swap:d1d6ea8c8be89d664a07a457526f7128109dee7030fdac424788d762c71ed111",
        {
          input: {
            input_image: targetImageUrl, // 가벼운 인터넷 URL 전송 (422 에러 원천 차단)
            swap_image: image,          // 사용자 얼굴 사진 (Base64)
          },
        }
    );

    if (!output) {
      throw new Error("Replicate did not return any output.");
    }

    const resultImageUrl = output.toString();
    console.log(`✨ Face Swap Successful! Result URL: ${resultImageUrl}`);

    return NextResponse.json({ resultUrl: resultImageUrl });

  } catch (error: any) {
    // 중복 읽기 에러를 방지하도록 깔끔하게 정돈된 에러 로그
    console.error("💥 [Backend] Execution Failed:", error.message || error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}