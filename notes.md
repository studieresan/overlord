These notes are from studs 2025 where the server stopped working and had to be rebuilt from scratch.

This was done by install a new ubuntu build and then installing the following packages:
    nginx
    nodejs
    npm
    cloning the git repo 
    install mongodb (https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-ubuntu/)

The domain is hosted in cloudflare.

Due to RAM issues in the server builds has to be done from local machine. Then the build is copied to the server using scp.
```
scp -r ./dist/ root@152.42.135.40:/home/it/overlord/
```

when setting up NGINX for this year, I had some issues with allowing the frontend to access the server. This lead to most of the managment of which origins are allowed to access the server being done in nginx. This might not be ideal, but as my year wasnt going to develop new features on the website, I went with this solution.

However, this means that the nginx config has to be updated if more frontend work using netlify testing should be done.
