export const generateAvatarUrl = (avatar) => {
    if (!avatar || typeof avatar !== "object") return null;
  
    try {
      const {
        topType = "NoHair",
        accessoriesType = "Blank",
        hairColor = "Black",
        facialHairType = "Blank",
        clotheType = "ShirtCrewNeck",
        clotheColor = "Black",
        eyeType = "Default",
        eyebrowType = "Default",
        mouthType = "Default",
        skinColor = "Light",
        hatColor = "Black",
        graphicType = "Pizza"
      } = avatar;
  
      const query = new URLSearchParams({
        avatarStyle: "Circle",
        topType,
        accessoriesType,
        hairColor,
        facialHairType,
        clotheType,
        clotheColor,
        eyeType,
        eyebrowType,
        mouthType,
        skinColor,
        hatColor,
        graphicType
      });
  
      return `https://avataaars.io/?${query.toString()}`;
    } catch (e) {
      console.error("Error generating avatar URL:", e);
      return null;
    }
  };
  