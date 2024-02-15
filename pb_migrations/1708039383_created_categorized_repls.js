/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "9xmcj7a7rgxmz26",
    "created": "2024-02-15 23:23:03.788Z",
    "updated": "2024-02-15 23:23:03.788Z",
    "name": "categorized_repls",
    "type": "view",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "dal5olfd",
        "name": "category",
        "type": "text",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "aoyih4t3",
        "name": "user",
        "type": "relation",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "collectionId": "_pb_users_auth_",
          "cascadeDelete": true,
          "minSelect": null,
          "maxSelect": 1,
          "displayFields": [
            "id",
            "username"
          ]
        }
      },
      {
        "system": false,
        "id": "gce0jzxf",
        "name": "name",
        "type": "text",
        "required": true,
        "presentable": false,
        "unique": false,
        "options": {
          "min": 2,
          "max": null,
          "pattern": ""
        }
      }
    ],
    "indexes": [],
    "listRule": null,
    "viewRule": null,
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
    "options": {
      "query": "select category, user, name,  (ROW_NUMBER() OVER()) as id from repls"
    }
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("9xmcj7a7rgxmz26");

  return dao.deleteCollection(collection);
})
