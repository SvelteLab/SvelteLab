/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("4231um01lpl5v14")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "rndazlk7",
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
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("4231um01lpl5v14")

  // remove
  collection.schema.removeField("rndazlk7")

  return dao.saveCollection(collection)
})
