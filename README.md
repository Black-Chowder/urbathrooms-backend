# URBathrooms Backend
A REST API designed as a backend for [URBathrooms.com](https://urbathrooms.heroku.com "UR Bathrooms") to request bathroom locations from a database and send that infromation back to the frontend

## Environment Variables
### DB_URI
//TODO: Description

### EDIT_KEY
//TODO: Description

### ORIGIN
//TODO: Description

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

Returns the id of the created image

Example call: `http://localhost:5000/newLocation?latitude=43.1300278&longitude=-77.6267076&name=Susan%20B.%20Anthony&campus=river`

### POST `/uploadImage`
//TODO: Add Description

### PATCH `/setDescription`
Queries:
* `id: string` the id of the location for which this description applies
* `description: string`

Returns the id of the location for which this description applies

Example call: `http://localhost:5000/setDescription?id=626864bcda48ea4faac85045&description=Description%20goes%20here`

### PATCH `/setPreviewImage`
Queries:
* `id: string` the id of the location for which this image applies
* `previewImage: string` the id of the image.  Note that the image must already be in the database and this id refers to its id in the database

Returns the id of the location for which this image applies

Example call: `http://localhost:5000/setLocationPreviewImage?id=626864bcda48ea4faac85045&previewImage=6265eff6202cb7ff6d008d58`

### PATCH `/addLocationImage`
Queries:
* `id: string` the id of the location for which this image applies
* `imageId: string` the id of the image.  Note that the image must already be in the database and this id refers to its id in the database

Returns the id of the location for which this image applies

Example call: `http://localhost:5000/addLocationImage?id=626c001284f38641986b4ce1&imageId=626b2db49e1aa116b81977da`

### PATCH `/clearLocationImages`
Queries:
* `id: string` the id of the location for which images are to be cleared

Clears the location's array of image ids.  Note that it does not remove the images from the database.

Returns the id of this location

Example call: `http://localhost:5000/clearLocationImages?id=626864bcda48ea4faac85045`

### PATCH `/removeLocationImage`
Queries:
* `id: string` the id of the location for which an image is to be deleted
* `imageIndex: number` the index in the location's image array to be deleted

Removes a location's image from its image array.  Note that it does not remove the image from the database.

Returns the id of this location

Example call: `http://localhost:5000/removeLocationImage?id=626864bcda48ea4faac85045&imageIndex=0`

### DELETE `delImage/:id`

Deletes an image from the database

Only returns status of call

Example call: `http://localhost:5000/delImage/6265eff6202cb7ff6d008d58`
