# URBathrooms Backend
A REST API designed as a backend for [URBathrooms.com](https://urbathrooms.heroku.com "UR Bathrooms") to request bathroom locations from a database and send that infromation back to the frontend

## Environment Variables
### DB_URI
The URI to access the MongoDB database.

### EDIT_KEY
Certain API requests use this as a password to confirm only select users can use certain features.

### ORIGIN
CORS origin.  Should be URL of frontend, or \* if made a public API.

## API Requests

### GET `/locations`
Queries:
* `campus: string`

Returns an array of locations on a given campus.
```TypeScript
type location = {
    _id: string;
    latitude: number;
    longitude: number;
    name: string;
    rating: number;
    description: string
    campus: string
    previewImage: string;  // Stores image id
    images: string[];  // Stores image ids
}
```
Images are stored as string ids and can be requested separately.

Example call: `http://localhost:5000/locations?campus=river`

### GET `/images/:id`
Returns the image of the requested id

Example call: `http://localhost:5000/images/6269e80176219d1adce421ad`

### POST `/newLocation`
Queries:
* `latitude: number`
* `longitude: number`
* `name: string`
* `campus: string`
* `key: string` Edit key to authenticate request access

Returns the id of the created location

Example call: `http://localhost:5000/newLocation?latitude=43.1300278&longitude=-77.6267076&name=Susan%20B.%20Anthony&campus=river&key=12345`

### POST `/uploadImage`
Queries:
* `key: string` Edit key to authenticate request access
Also requests multipart 'picture' in PNG format

Returns the id of the uploaded image

### PATCH `/setDescription`
Queries:
* `id: string` the id of the location for which this description applies
* `description: string`
* `key: string` Edit key to authenticate request access

Returns the id of the location for which this description applies

Example call: `http://localhost:5000/setDescription?id=626864bcda48ea4faac85045&description=Description%20goes%20here&key=12345`

### PATCH `/setPreviewImage`
Queries:
* `id: string` the id of the location for which this image applies
* `previewImage: string` the id of the image.  Note that the image must already be in the database and this id refers to its id in the database
* `key: string` Edit key to authenticate request access

Returns the id of the location for which this image applies

Example call: `http://localhost:5000/setLocationPreviewImage?id=62784ebc57ce50f12da7eddd&previewImage=62784ef457ce50f12da7eddf&key=12345`

### PATCH `/addLocationImage`
Queries:
* `id: string` the id of the location for which this image applies
* `imageId: string` the id of the image.  Note that the image must already be in the database and this id refers to its id in the database
* `key: string` Edit key to authenticate request access

Returns the id of the location for which this image applies

Example call: `http://localhost:5000/addLocationImage?id=62784ebc57ce50f12da7eddd&imageId=62784ef457ce50f12da7eddf&key=12345`

### PATCH `/clearLocationImages`
Queries:
* `id: string` the id of the location for which images are to be cleared
* `key: string` Edit key to authenticate request access

Clears the location's array of image ids.  Note that it does not remove the images from the database.

Returns the id of this location

Example call: `http://localhost:5000/clearLocationImages?id=626864bcda48ea4faac85045&key=12345`

### PATCH `/removeLocationImage`
Queries:
* `id: string` the id of the location for which an image is to be deleted
* `imageIndex: number` the index in the location's image array to be deleted
* `key: string` Edit key to authenticate request access

Removes a location's image from its image array.  Note that it does not remove the image from the database.

Returns the id of this location

Example call: `http://localhost:5000/removeLocationImage?id=6277eb5857ce50f12da7ed7d&imageIndex=0&key=12345`

### DELETE `delImage/:id`
Queries:
* `key: string` the edit key to confirm the person attempting to delete the image has permission to do so.

Deletes an image from the database

Only returns status of call

Example call: `http://localhost:5000/delImage/6265eff6202cb7ff6d008d58?key=12345`
