import sql from "mssql";
import { devConfig } from "../config/devDb.config";
import { personMainColumn } from "../utils/person.mainColumn";

export const selectPerson = async (filter: string, page: string) => {
  try {
    let pool = await sql.connect(devConfig);
    let result = await pool
      .request()
      .input("filter", sql.NVarChar, filter)
      .input("page", sql.Int, page)
      .query(
        `
        WITH Person As (
            SELECT 
                ROW_NUMBER() OVER(ORDER BY p.person_id ASC) no,
        
                p.person_id,
        
                p.nickname,
        
                COALESCE(p.firstname + ' ', '') + COALESCE(p.lastname + '', '') full_name,
        
                STUFF((
                    SELECT ', ' + ct.value 
                    FROM DevelopERP_ForTesting..Contact ct
                    WHERE ct.person_id = p.person_id AND ct.contact_code_id = 2
                    FOR XML PATH('')
                ), 1, 2, '') mobile,
        
                STUFF((
                    SELECT ', ' + ct.value 
                    FROM DevelopERP_ForTesting..Contact ct
                    WHERE ct.person_id = p.person_id AND ct.contact_code_id = 3
                    FOR XML PATH('')
                ), 1, 2, '') email,
        
                STUFF((
                    SELECT ', ' + mc.value
                    FROM DevelopERP_ForTesting..Person_Role pr
                    INNER JOIN DevelopERP_ForTesting..MasterCode mc ON pr.role_code_id = mc.code_id
                    WHERE p.person_id = pr.person_id
                    FOR XML PATH('')
                ), 1, 2, '') role,
        
                p.description
        
            FROM DevelopERP_ForTesting..Person p
        )
        
        SELECT * FROM Person
        WHERE no BETWEEN (@page-1)*10+1 AND (@page-1)*10+10
        `
      );
    return {
      customer: result.recordset,
    };
  } catch (err) {
    return { response: err };
  }
};

export const selectAllPerson = async (filter: string) => {
  try {
    let pool = await sql.connect(devConfig);
    let result = await pool
      .request()
      .input("filter", sql.NVarChar, filter)
      .query(
        `
            SELECT 
                ${personMainColumn}
        
            FROM DevelopERP_ForTesting..Person p
            WHERE COALESCE(p.firstname + ' ', '') + COALESCE(p.lastname + '', '') LIKE @filter
        `
      );
    return {
      customer: result.recordset,
    };
  } catch (err) {
    return { response: err };
  }
};
