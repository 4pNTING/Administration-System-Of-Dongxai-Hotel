export const FILE_TYPES = {
    IMAGE: {
        JPEG: 'image/jpeg',
        PNG: 'image/png',
        WEBP: 'image/webp'
    },
    DOCUMENT: {
        PDF: 'application/pdf'
    }
};

export const ACCEPTED_FILE_TYPES = {
    DEFAULT: `${FILE_TYPES.IMAGE.JPEG}, ${FILE_TYPES.IMAGE.PNG}, ${FILE_TYPES.IMAGE.WEBP}, ${FILE_TYPES.DOCUMENT.PDF}`,
    IMAGES_ONLY: `${FILE_TYPES.IMAGE.JPEG}, ${FILE_TYPES.IMAGE.PNG}, ${FILE_TYPES.IMAGE.WEBP}`,
    PDF_ONLY: FILE_TYPES.DOCUMENT.PDF
};

export const MAX_FILE_SIZE_MB = 5;