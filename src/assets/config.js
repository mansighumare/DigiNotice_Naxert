var appConfig = {};
if (window.location.hostname == "localhost") {   
    appConfig = {
        apiUrl: "https://api.diginotice.in/api/",
        authUrl: "https://api.diginotice.in/",
        // apiUrl: "http://localhost:55277/api/",
        // authUrl: "http://localhost:55277/",
        imagePath: "https://digiimages.blob.core.windows.net/noticeimages/NoticeImage/",
        imageAdBannerPath: "https://digiimages.blob.core.windows.net/noticeimages/",
        pdfPath: "https://digiimages.blob.core.windows.net/noticeimages/Pdf/",
        propertyImgPath: "https://digiimages.blob.core.windows.net/noticeimages/PropertyImage/",
        orgPropertyImgPath: "https://digiimages.blob.core.windows.net/noticeimages/OrgPropertyImage/",
        profileImgPath: "https://digiimages.blob.core.windows.net/noticeimages/ProfileImage/",
        contactNumber: "+91 7720054444",
        
    }
} else {
    appConfig = {
        apiUrl: "https://api.diginotice.in/api/",
        authUrl: "https://api.diginotice.in/",
        imagePath: "https://digiimages.blob.core.windows.net/noticeimages/NoticeImage/",
        imageAdBannerPath: "https://digiimages.blob.core.windows.net/noticeimages/",
        pdfPath: "https://digiimages.blob.core.windows.net/noticeimages/Pdf/",
        propertyImgPath: "https://digiimages.blob.core.windows.net/noticeimages/PropertyImage/",
        orgPropertyImgPath: "https://digiimages.blob.core.windows.net/noticeimages/OrgPropertyImage/",
        profileImgPath: "https://digiimages.blob.core.windows.net/noticeimages/ProfileImage/",
        contactNumber: "+91 7720054444",
    }
}