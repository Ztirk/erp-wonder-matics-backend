WITH Address AS (
    SELECT ROW_NUMBER() OVER(
            ORDER BY a.Address_id ASC
        ) no,
        a.address_id,
        COALESCE(a.name + ' ', '') + COALESCE(a.house_no + ' ', '') + COALESCE(a.village_no + ' ', '') + COALESCE(a.alley + ' ', '') + COALESCE(a.road + ' ', '') + COALESCE(a.sub_district + ' ', '') + COALESCE(a.district + ' ', '') + COALESCE(a.province + ' ', '') + COALESCE(a.postal_code + ' ', '') location,
        STUFF(
            (
                SELECT ', ' + mc.value
                FROM DevelopERP_ForTesting..Address_MasterCode amc
                    INNER JOIN DevelopERP_ForTesting..MasterCode mc ON amc.address_type_code_id = mc.code_id
                WHERE amc.address_id = a.address_id FOR XML PATH('')
            ),
            1,
            2,
            ''
        ) address_type
    FROM DevelopERP_ForTesting..Address a
    WHERE COALESCE(a.name + ' ', '') + COALESCE(a.house_no + ' ', '') + COALESCE(a.village_no + ' ', '') + COALESCE(a.alley + ' ', '') + COALESCE(a.road + ' ', '') + COALESCE(a.sub_district + ' ', '') + COALESCE(a.district + ' ', '') + COALESCE(a.province + ' ', '') + COALESCE(a.postal_code + ' ', '') LIKE @filter
)
SELECT *
FROM Address
WHERE no BETWEEN (@page -1) * 10 + 1 AND (@page -1) * 10 + 10