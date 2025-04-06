import blackBoardLogo from "../assets/icons/form/blackBoardlogo.svg";
import facebookLogo from "../assets/icons/form/facebookLogo.svg";
import instaLogo from "../assets/icons/form/instaLogo.svg";
import linkedInLogo from "../assets/icons/form/linkedInLogo.svg";
import pinterestLogo from "../assets/icons/form/pintrestLogo.svg";
import snapchatLogo from "../assets/icons/form/snapchatLogo.svg";
import tiktokLogo from "../assets/icons/form/tiktokLogo.svg";
import twitterLogo from "../assets/icons/form/twitterLogo.svg";
import otherLogo from "../assets/icons/form/otherLogo.svg";
import blackboardCard from "../assets/icons/common/blackboardCard.svg";
import facebookCard from "../assets/icons/common/facebookCard.svg";
import instagramCard from "../assets/icons/common/instagramCard.svg";
import linkedinCard from "../assets/icons/common/linkedinCard.svg";
import pinterestCard from "../assets/icons/common/pintrestCard.svg";
import snapchatCard from "../assets/icons/common/snapchatCard.svg";
import tiktokCard from "../assets/icons/common/tiktokCard.svg";
import twitterCard from "../assets/icons/common/twitterCard.svg";
import otherCard from "../assets/icons/common/otherCard.svg";
import ebayLogo from "../assets/icons/form/ebayLogo.svg";
import ebayCard from "../assets/icons/common/ebayCard.svg";
import paypalLogo from "../assets/icons/form/paypalLogo.svg";
import paypalCard from "../assets/icons/common/paypalCard.svg";
import amazonLogo from "../assets/icons/form/amazonLogo.svg";
import amazonCard from "../assets/icons/common/amazonCard.svg";
import redditCard from "../assets/icons/common/redditCard.svg";
import redditLogo from "../assets/icons/form/redditLogo.svg";
import githubCard from "../assets/icons/common/githubCard.svg";
import githubLogo from "../assets/icons/form/githubLogo.svg";
import chessLogo from "../assets/icons/form/chessLogo.svg";
import chessCard from "../assets/icons/common/chessCard.svg";
import battlenetLogo from "../assets/icons/form/battlenetLogo.svg";
import battlenetCard from "../assets/icons/common/battlenetCard.svg";
import pearsonCard from "../assets/icons/common/pearsonCard.svg";
import pearsonLogo from "../assets/icons/form/pearsonLogo.svg";
import zoomCard from "../assets/icons/common/zoomCard.svg";
import zoomLogo from "../assets/icons/form/zoomLogo.svg";

export const serviceTypes = [
  {
    id: 1,
    value: "Banking",
  },
  {
    id: 2,
    value: "Social Media",
  },
  {
    id: 3,
    value: "Email",
  },
  {
    id: 4,
    value: "Health Care",
  },
  {
    id: 5,
    value: "Education",
  },
  {
    id: 6,
    value: "Entertainment",
  },
  {
    id: 7,
    value: "Shopping",
  },
  {
    id: 8,
    value: "Streaming Platform",
  },
  {
    id: 9,
    value: "Work Account",
  },
  {
    id: 10,
    value: "Travel and Hospitality",
  },
  {
    id: 11,
    value: "Other",
  },
];

export const serviceNames = [
  {
    id: 1,
    name: "Facebook",
    image: facebookLogo,
    card: facebookCard,
    url: "https://www.facebook.com/",
    Description:
      "A popular social networking platform for connecting with friends and family, sharing updates, and joining groups.",
  },
  // {
  //   //DOESNT AUTOFILL
  //   id: 2,
  //   name: "Twitter",
  //   image: twitterLogo,
  //   card: twitterCard,
  //   url: "https://twitter.com/i/flow/login",
  //   Description:
  //     "A microblogging platform for sharing short messages, links, and multimedia with a global audience.",
  // },
  // {
  //   //DOESNT AUTOFILL
  //   id: 3,
  //   name: "Instagram",
  //   image: instaLogo,
  //   card: instagramCard,
  //   url: "https://www.instagram.com/accounts/login/",
  //   Description:
  //     "A photo and video sharing platform with features like Stories, Reels, and IGTV.",
  // },
  {
    id: 2,
    name: "LinkedIn",
    image: linkedInLogo,
    card: linkedinCard,
    url: "https://linkedin.com/login",
    Description:
      "A professional networking platform for connecting with colleagues, job searching, and business networking.",
  },
  // {
  //   //IT SAYS EMPTY INPUT FIELD
  //   id: 5,
  //   name: "Snapchat",
  //   image: snapchatLogo,
  //   card: snapchatCard,
  //   url: "https://accounts.snapchat.com/accounts/v2/login",
  //   Description:
  //     "A multimedia messaging app known for its temporary photo and video sharing, Stories, and filters.",
  // },
  // {
  //   //DOESNT AUTOFILL
  //   id: 6,
  //   name: "Pinterest",
  //   image: pinterestLogo,
  //   card: pinterestCard,
  //   url: "https://www.pinterest.com/login/",
  //   Description:
  //     "A visual discovery and bookmarking platform for finding and organizing ideas, recipes, and inspiration.",
  // },
  // {
  //   //DOESNT AUTOFILL
  //   id: 7,
  //   name: "TikTok",
  //   image: tiktokLogo,
  //   card: tiktokCard,
  //   url: "https://www.tiktok.com/login/phone-or-email/email",
  //   Description:
  //     "A short-form video sharing app where users can create and watch entertaining videos.",
  // },
  // {
  //   //DOESNT AUTOFILL (sometimes yes sometimes no)
  //   id: 8,
  //   name: "Blackboard",
  //   image: blackBoardLogo,
  //   card: blackboardCard,
  //   url: "https://sts.qu.edu.qa/adfs/ls/?SAMLRequest=fVHBbsIwDP2VyPc2bYCNRRTEhtCQmEC07LALyoKBoDaFOEX7%2FJUCGrtwcWTl%2BT37vd7gp8jZCR2Z0iYQhxEwtLpcG7tNYJmNgy4M%2Bj1SRS4Oclj5nV3gsULyrB60JC8%2FCVTOylKRIWlVgSS9lunwYypFGMmDK32pyxzYkAidr6XeSktVgS5FdzIal4tpAjvvDyQ5xxyVs%2FUC4bEKcV2FR8VVrRyctXhT0nTGVW4U8VXcEqsY2KheyVjlmzNuTOTpnmO9IZ4TBzYuncbmmAQ2KicENhkloOK26KiOwH1rHe%2Bf9zEKrbXR57fztK1BNFdE5oR%2FY0QVTix5ZX0CIhLtIGoHopvFLRnFstUJXyLxBWx%2BteDV2Iu1j%2Fz6voBIvmfZPJjP0gzY5y2iGgDXQGSj7u6TeEysbvZD%2F4HZPX7P3r%2B2%2F9Pv%2FwI%3D&SigAlg=http%3A%2F%2Fwww.w3.org%2F2001%2F04%2Fxmldsig-more%23rsa-sha256&Signature=uICNw2Sx1OzrnOZfXVOAQTu8aeWPPXXV0nPIKXLh4vAHSGOVYDbrBZOLCDu5UBpn4wmcYYfEi2DgMiyzG5N%2BxdqmA9m17YRlMYTJDbMzL2M5SFiu2ZDh6FUupc6ictJP2cYhyBKgkkH%2FRkA32cw9x4zANnzIXhj17WJU0jf42hgQKpZ0bgQ8LgruwLmV3gwtQvCv90dnKS1Z%2B6AUA5JIl1tdTYqw4l4dXSO7XOhjZZ9fXc1S5IUNt9Ry%2B8x3JVwpwnYZf1BnvhwEYY4RUnfM00W5Iay%2B7iPrQdtNM%2BBWukR4r%2BD2XEVTWbiTJJhmXMzlfHlG8i0AczeumH4f8IHJ1w%3D%3D&client-request-id=9ea64e06-1737-4ac1-220c-0080010c00df&pullStatus=0",
  //   Description:
  //     "A virtual learning environment and course management system for online education.",
  // },
  {
    id: 3,
    name: "Amazon",
    image: amazonLogo,
    card: amazonCard,
    url: "https://www.amazon.com/ap/signin?openid.pape.max_auth_age=0&openid.return_to=https%3A%2F%2Fwww.amazon.com%2Fs%3Fk%3Da%2Bmazon%2Bcom%26adgrpid%3D127260490003%26hvadid%3D585479351039%26hvdev%3Dc%26hvlocphy%3D1011785%26hvnetw%3Dg%26hvqmt%3Db%26hvrand%3D6590575389762096706%26hvtargid%3Dkwd-321362582074%26hydadcr%3D27983_14525522%26tag%3Dhydglogoo-20%26ref%3Dnav_signin&openid.identity=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&openid.assoc_handle=usflex&openid.mode=checkid_setup&openid.claimed_id=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&openid.ns=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0",
    Description:
      "An online marketplace for shopping, selling, and streaming entertainment.",
  },
  {
    id: 4,
    name: "Ebay",
    image: ebayLogo,
    card: ebayCard,
    url: "https://signin.ebay.com/ws/eBayISAPI.dll?SignIn&sgfl=gh&ru=https%3A%2F%2Fwww.ebay.com%2F",
    Description:
      "An online auction and shopping website for buying and selling a wide variety of goods.",
  },
  {
    id: 5,
    name: "PayPal",
    image: paypalLogo,
    card: paypalCard,
    url: "https://www.paypal.com/signin",
    Description:
      "An online payment platform for sending and receiving money securely.",
  },
  {
    id: 6,
    name: "Reddit",
    image: redditLogo,
    card: redditCard,
    url: "https://www.reddit.com/login",
    Description:
      "A social news aggregation, web content rating, and discussion website.",
  },
  {
    id: 7,
    name: "Github",
    image: githubLogo,
    card: githubCard,
    url: "https://github.com/login",
    Description: "Github",
  },
  {
    id: 8,
    name: "Chess",
    image: chessLogo,
    card: chessCard,
    url: "https://www.chess.com/login",
    Description: "Chess.com",
  },
  {
    id: 9,
    name: "Battle Net",
    image: battlenetLogo,
    card: battlenetCard,
    url: "https://eu.account.battle.net/login/en-us/",
    Description: "Battle Net",
  },
  {
    id: 10,
    name: "Pearson",
    image: pearsonLogo,
    card: pearsonCard,
    url: "https://login.pearson.com/v1/piapi/piui/signin?client_id=dN4bOBG0sGO9c9HADrifwQeqma5vjREy",
    Description: "Pearson",
  },
  {
    id: 11,
    name: "Zoom",
    image: zoomLogo,
    card: zoomCard,
    url: "https://zoom.us/signin#/login",
    Description: "Zoom",
  },
  {
    id: 12,
    name: "Other",
    image: otherLogo,
    card: otherCard,
    url: "",
    Description: "Other",
  },
];
