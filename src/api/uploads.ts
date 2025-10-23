import { typedFetch } from "@/lib/typedFetch";
import { DeleteFolderResponseSchema, UploadImageSchema, UploadsFolderArraySchema } from "@/validation/uploads";

export const uploadImage = (file: File, slug: string, type?: string) => {
    const formData = new FormData();
    formData.append("files", file);

    return typedFetch(
        `/uploads/public/${type || 'blog'}/${slug}`,
        UploadImageSchema,
        {
            method: "post",
            data: formData,
            headers: {
                "Content-Type": "multipart/form-data"
            }
        }
    );
};

export const deleteFolder = (scope: string, category: string, folder: string) => {
    const url = `/uploads/${scope}/${category}/${folder}`;
    return typedFetch(
        url,
        DeleteFolderResponseSchema,
        { method: "delete", withCredentials: true }
    );
}

export const uploadPrivateImage = (file: File, slug: string, type: string) => {
    const formData = new FormData();
    formData.append("files", file);

    return typedFetch(
        `/uploads/private/${type}/${slug}`,
        UploadImageSchema,
        {
            method: "post",
            data: formData,
            headers: {
                "Content-Type": "multipart/form-data"
            }
        }
    );
};

export const uploadPrivateFiles = (files: File[], slug: string, type: string) => {
    const formData = new FormData();
    files.forEach((file) => {
        formData.append("files", file);
    });

    return typedFetch(
        `/uploads/private/${type}/${slug}`,
        UploadImageSchema,
        {
            method: "post",
            data: formData,
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );
};

export const uploadHomepageFiles = (files: File[]) => {
    const formData = new FormData();
    files.forEach((file) => {
        formData.append("files", file);
    });

    return typedFetch(
        `/uploads/public/homepage`,
        UploadImageSchema,
        {
            method: "post",
            data: formData
        }
    );
};

export const deleteFilesHomepage = (filename: string) => {
    return typedFetch(
        filename,
        DeleteFolderResponseSchema,
        { method: "delete", withCredentials: true }
    );
}

export const getFolder = (type: "private" | 'public' | '', url: string) => {
    return typedFetch(`${url ? url : '/uploads/' + type}`, UploadsFolderArraySchema)
}