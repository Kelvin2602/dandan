import { utils, writeFile } from 'xlsx';

export const ExportService = {
    /**
     * Export data to Excel file
     * @param data Array of objects to export
     * @param filename Desired filename (without extension)
     * @param sheetName Name of the worksheet
     */
    exportToExcel: (data: any[], filename: string, sheetName: string = 'Sheet1') => {
        // 1. Create a new workbook
        const wb = utils.book_new();

        // 2. Convert JSON data to worksheet
        const ws = utils.json_to_sheet(data);

        // 3. Append worksheet to workbook
        utils.book_append_sheet(wb, ws, sheetName);

        // 4. Write and download file
        writeFile(wb, `${filename}.xlsx`);
    }
};
