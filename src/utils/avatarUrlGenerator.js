export const generateAvatarUrl = (avatar, fallbackGender = "neutral") => {
  const capitalize = (s) => {
    if (!s || typeof s !== "string") return "";
    return s.charAt(0).toUpperCase() + s.slice(1);
  };

  // Defaults if avatar is missing or "no rewards"
  if (!avatar || avatar.avatarType === "no rewards") {
    if (fallbackGender === "male") {
      return "https://avataaars.io/?avatarStyle=Circle&topType=ShortHairWavy&accessoriesType=Blank&hairColor=BrownDark&facialHairType=Blank&clotheType=BlazerShirt&clotheColor=Black&eyeType=Default&eyebrowType=Default&mouthType=Default&skinColor=Brown";
    } else if (fallbackGender === "female") {
      return "https://avataaars.io/?avatarStyle=Circle&topType=LongHairStraight2&accessoriesType=Blank&hairColor=BrownDark&facialHairType=Blank&clotheType=BlazerShirt&clotheColor=PastelRed&eyeType=Default&eyebrowType=Default&mouthType=Smile&skinColor=Light";
    } else {
      return "https://avataaars.io/?avatarStyle=Circle&topType=ShortHairShortFlat&accessoriesType=Blank&hairColor=BrownDark&facialHairType=Blank&clotheType=GraphicShirt&clotheColor=Blue01&eyeType=Default&eyebrowType=Default&mouthType=Smile&skinColor=Light";
    }
  }

  // Build URL from avatar data
  const baseUrl = "https://avataaars.io/";
  const params = new URLSearchParams({
    avatarStyle: "Circle",
    topType: avatar.topType || "ShortHairShortFlat",
    accessoriesType: avatar.accessoriesType || "Blank",
    hairColor: capitalize(avatar.hairColor || "BrownDark"),
    hatColor: capitalize(avatar.hatColor || "Black"),
    facialHairType: avatar.facialHairType || "Blank",
    clotheType: avatar.clotheType || "ShirtCrewNeck",
    clotheColor: capitalize(avatar.clotheColor || "Blue01"),
    graphicType: capitalize(avatar.graphicType || "Pizza"),
    eyeType: avatar.eyeType || "Default",
    eyebrowType: avatar.eyebrowType || "Default",
    mouthType: avatar.mouthType || "Smile",
    skinColor: avatar.skinColor || "Light"
  });

  return `${baseUrl}?${params.toString()}`;
};