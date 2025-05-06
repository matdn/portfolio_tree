# Episode configuration

### Episode properties
Properties which are not documented here are not mandatory. They are managed by backend.

| Property       | Description                                                                        | Note                                                                                                                                                             | Mandatory |
|----------------|------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------|
| `name`         | Episode ID. The episode ID must be updated to user profile before create a room.   | Can use some theater ID to set EpisodeID. When a theater is started, if ID of the theater matches with an Episode ID then a room will be created for the episode | ✅         |
| `title`        | Title of an episode                                                                | Should be a translation key which will be translated in the application                                                                                          | ❌         |
| `description`  | Description of an episode                                                          | Should be a translation key which will be translated in the application                                                                                          | ❌         |
| `status`       | Status of an episode                                                               |                                                                                                                                                                  | ✅         |
| `maxScore`     | Max score of an episode                                                            |                                                                                                                                                                  | ❌         |
| `thumbnailUrl` | Thumbnail image of an episode                                                      |                                                                                                                                                                  | ❌         |
| `customData`   | Specific episode data for project                                                  | Free to use, no limits for its format                                                                                                                            | ❌         |
| `scenes`       | An episode must have 1 to many scenes, like a chapter must have 1 to many theaters |                                                                                                                                                                  | ✅         |

### Scene properties
| Property   | Description                          | Note                                                                                                         | Mandatory |
|------------|--------------------------------------|--------------------------------------------------------------------------------------------------------------|-----------|
| `name`     | For backend use only                 | Name of a scene can be whatever but it has to be unique. There must not be 2 equal scene names in an episode | ✅         |
| `elements` | A scene must have 1 to many elements |                                                                                                              |           |

### Scene element properties
| Property           | Description                            | Note                                                             | Mandatory |
|--------------------|----------------------------------------|------------------------------------------------------------------|-----------|
| `name`             | Scene element ID                       | Use GameId to set element ID                                     | ✅         |
| `allowCustomScore` | Allow indefinite score sent to backend | The element has score which is depended on user playing the game | ❌         |
| `score`            | Fixed score of the element             | User earns a fixed score if he collected this element            | ❌         |                                       

```json
[
  {
    "id": "EPISODE1",
    "title": "Episode 1",
    "description": "Description of Episode 1",
    "status": "AVAILABLE",
    "startDate": "2021-01-01T00:00:00.000Z",
    "endDate": "2021-01-31T00:00:00.000Z",
    "thumbnailUrl": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRfZcpvdnbhcRhQ_D-Gxk2yO_MEYCH6hGioKYRiM_rQjZJPez2kxbJ-ODzXYUFtU2uTh78&usqp=CAU",
    "maxScore": 0,
    "customData": [],
    "scenes": [
      {
        "name": "SCENE_1",
        "elements": [
          {
            "name": "ELEMENT_1",
            "allowCustomScore": true,
            "score": 0
          }
        ]
      }
    ]
  }
]
```
