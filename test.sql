WITH Fleet As (
            SELECT 
                ROW_NUMBER() OVER(ORDER BY f.fleet_id ASC) no,

			f.fleet_id,

			f.fleet_name,

			f.parent_fleet_id
        
            FROM DevelopERP_ForTesting..Fleet f
            WHERE f.fleet_name LIKE @filter
        )
        
        SELECT * FROM Fleet
        WHERE no BETWEEN (@page-1)*10+1 AND (@page-1)*10+10