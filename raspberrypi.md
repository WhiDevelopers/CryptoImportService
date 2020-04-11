#Linux
1. install git if don't have.

Used this tutorial: https://linuxize.com/post/how-to-install-git-on-raspberry-pi/

```
sudo apt update
sudo apt install git
```

2. clone the repo

Used these tutorials:
https://git-scm.com/book/en/v2/Git-Basics-Getting-a-Git-Repository
https://thisdavej.com/beginners-guide-to-installing-node-js-on-a-raspberry-pi/

Move to/create the directory you want the files to be
Commands I used.
```
ls = shows files and folders in list
mkdir = creates folder
cd = move to directory
```

Then clone the data from our github
```
git clone https://github.com/WhiDevelopers/CryptoImportService
```

Before running our code get latest node js.
```
$ curl -sL https://deb.nodesource.com/setup_13.x | sudo -E bash -
$ sudo apt install -y nodejs
```