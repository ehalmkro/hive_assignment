# Hive Helsinki bocal assignment

The purpose of this assignment was to make a script to find students who have done "bad evaluations" using the internal [42API](https://api.intra.42.fr/apidoc/). 

## Back end

My approach was to make a simple "microservice" using Node.js that pulls relevant data from the 42API, parses it together and displays it in the following 

### Endpoints:

* `GET /api/evaluations` gets all the evaluations from all 42 schools. Paginated by parameters `per_page` (default 30) and `page`, for example `GET /api/evaluations?per_page=50&page=2`

* `GET /api/evaluations/stats` gets selected evaluation quality related statistics from all of the 42 network.

* `GET /api/evaluations/stats/:id` gets same evaluation statistics for a specific user by `user_id`

* `GET /api/evaluations/per_campus` gets evaluations from a hard-coded campus, in this case Hive Helsinki. Parameters `page` and  `per_page` apply. Can be sorted by object name using paramter `sort`. Example: `GET /api/evaluations/per_campus?sort=evalGoodness` would get the evaluations from a specific campus in ascending order of evaluation quality. These could be considered as a starting poins when trying to catch 'bad' evaluations.

* `GET /api/evaluations/users` shows a list of users of the specific hard-coded campus (Hive).

The server handles the OAuth authentication and the initial data fetching using my own functions. I decided to code the authentication and API fetching myself because I did not have time to learn the proper use of specific libraries in the time frame of the assignment which was one week.

The fetched evaluation and user data are saved to a SQLite database **as blobs**. This is because of the same time limit I did not have time to debug SQLite JSON parsing on Node.js. The database's purpose is to simply store the fetched data, all the data parsing is done serverside with lodash. This is obviously very costly and inefficient compared to proper relational database usage and specific selection queries. For the purpose of the minimum viable product it serves well enough.

### Evaluation "quality"

The evaluations pulled from the API are first graded in their "quality". The MVP algorithm for this is simply taking into account three factors. Each account for 33% of evaluations quality that ranges from 0 to 100%.

Factors lessening the evaluation quality are:
* length of the evaluation session `<` 15 minutes (-33%)
* evaluator feedback text `<` 100 characters (-33%)
* evaluations rating by evaluated `<=` 3/5 (-33%)

The quality graded evaluations are stored in the database and later matched with user data from Hive Helsinki to parse all the evaluations that have been held at Hive. This data can be used e.g. in comparing Hive Helsinki evaluation averages with averages of the whole 42 Network. A better approach for this would have been a proper weighted grade calculator where it would be possible to change the weights of different factors.

My further pedagogical thoughts are detailed in the accompanying PDF.


## Front end

For the frontend I made a simple static React web app using Material UI. The frontend works as a dashboard-like view of the overall evaluations going on at a single campus. The feed highlights evaluations that have a score less than 66% on the quality scale. 

![dashboard view](../media/dashboard.png?raw=true)
![evaluation stats](../media/evaluationstats.png?raw=true)
![single evaluator info page](../media/evaluatorinfo.png?raw=true)



# How to run

## Setting the environment variables

To use the 42API, the server needs a `UID` and a `SECRET` value from the API either in the system's environment variables or in `/app/.env` file for dotenv. 42 students (and staff...) can get these from [intra](https://profile.intra.42.fr/oauth/applications).

## With Docker

Make sure you have your `.env` file set up at `./app/.env`.

``` 
cat ./app/.env
UID=[your userID]
SECRET=[your secret]
PORT=3001
```


`git clone https://github.com/ehalmkro/hive_assignment.git`

`cd hive_assignment`

`docker build -t ehalmkro/eval .`

`docker run -p 3001:3001 -d ehalmkro/eval`

The initialization will take a while as the server is fetching a lot of rate limited data from the API. You can watch your progress with 
`docker logs [container id]`

## Without Docker

Make sure you have either 
* your `.env` file set up at `./app/.env`.
* your environment variables set to match

``` 
cat ./app/.env
UID=[your userID]
SECRET=[your secret]
PORT=3001%
```

 `git clone https://github.com/ehalmkro/hive_assignment.git`
 
 `cd ./hive_assignment/app`
 
 `npm install && npm start`
 
The initialization will take a while as the server is fetching a lot of rate limited data from the API. 
 
 
## Additional commands

You can run `npm run fetch [time in hours]` to fetch evaluations from the last x hours. This deletes the existings database.

## Known issues

* No token renewal, server needs to be restarted every two hours as the token gets expired.
* Poor error handling on almost all of the cases, for example expired token.
