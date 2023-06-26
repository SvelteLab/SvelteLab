migrate((db) => {
  const collection = new Collection({
    "id": "4231um01lpl5v14",
    "created": "2023-06-26 20:50:39.199Z",
    "updated": "2023-06-26 20:50:39.199Z",
    "name": "repls",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "gqsfegcs",
        "name": "files",
        "type": "json",
        "required": true,
        "unique": false,
        "options": {}
      },
      {
        "system": false,
        "id": "8udknpm3",
        "name": "user",
        "type": "relation",
        "required": false,
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
        "id": "8hnolajl",
        "name": "name",
        "type": "text",
        "required": true,
        "unique": false,
        "options": {
          "min": 2,
          "max": null,
          "pattern": ""
        }
      }
    ],
    "indexes": [],
    "listRule": "",
    "viewRule": "",
    "createRule": "@request.auth.id != \"\"",
    "updateRule": "@request.auth.id = user.id",
    "deleteRule": "@request.auth.id = user.id",
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("4231um01lpl5v14");

  return dao.deleteCollection(collection);
})
