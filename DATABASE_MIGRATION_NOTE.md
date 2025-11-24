# Database Migration Required

## New Column: custom_items

To support the custom item feature, the `parties` table in Supabase needs a new column.

### SQL Migration

```sql
ALTER TABLE parties
ADD COLUMN custom_items JSONB DEFAULT '{}'::jsonb;
```

### Description

The `custom_items` column stores user-defined items for each category in the format:

```json
{
  "category-id": [
    {
      "id": "custom-uuid",
      "name": "Item Name",
      "description": "Custom item"
    }
  ]
}
```

This allows hosts to add custom items to any category that aren't in the default BOARD_DATA.
