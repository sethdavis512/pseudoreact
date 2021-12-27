import JSZip from "jszip";
import FileSaver from "file-saver";

const zip = new JSZip();

export const addFileToZip = (fileName: string, extension = "tsx", data: any) =>
    zip.file(`${fileName}.${extension}`, data);

export const saveZip = (fileName: string) =>
    zip.generateAsync({ type: "blob" }).then((content) => {
        FileSaver.saveAs(content, `${fileName}.zip`);
    });
