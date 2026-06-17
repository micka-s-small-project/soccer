import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { image, country } = await request.json();

    if (!image || !country) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const formattedCountry = country.toLowerCase().replace(/ /g, "-");

    const randomNumber = Math.random() < 0.5 ? 1 : 2;

    // 3. ✨ 최종 템플릿 이미지 경로 동적 생성
    // 결과 예시: "/templates/united-kingdom-1.png" 또는 "/templates/south-korea-2.png"
    const templateImageUrl = `/templates/${formattedCountry}/${formattedCountry}-${randomNumber}.png`;

    // [콘솔 확인용] 서버 터미널에 찍히는 로그
    console.log(`🤖 Generated Template Path: ${templateImageUrl}`);


    // -------------------------------------------------------------
    // 4. 🔥 여기에 나중에 Face Swap API 연동 로직이 들어갑니다.
    // -------------------------------------------------------------
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // 5. 프론트엔드로 결과 반환
    return NextResponse.json({ resultUrl: templateImageUrl });

  } catch (error) {
    console.error("Route Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}