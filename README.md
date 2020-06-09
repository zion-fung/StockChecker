# StockChecker
Checks certain sites to see if a product is in stock, then emails the results

```
/* Sample output
----------
Store: Kotn
---
Item: Essential Crew T-Shirt
Colors:
- (Link) Heather Grey: In Stock 
- (Link) Navy: In Stock
- (Link) Army Green: Out of Stock
- (Link) Charcoal Melange: Out of Stock
----------
/*
```

### Folder Structure
- Stores: Outer Folder containing 1 folder per store
    - Kotn: Store reprsenting the store Kotn
        - Essential Crew: Item that we're checking for inside the above store
- Emailer: Folder containing index simple nodemailer file for sending emails
- ...

### Dependencies
- minimist: used for parsing cmd line args
- nodemailer: used for sending email notifications
- playwright: although primarily used for browser automation testing, used here for scraping in headless mode

### Raspberry PI 4 Support
Written to run on Windows 10, but with a few modifications it can run easily to run on a rpi4.

- Step 1: Add the "executablePath" argument to chromium.launch() --> ```{ executablePath: "/bin/chromium-browser" }```
- Step 2 (Optional): Add process.exit() in the root folder's index.js file since closing chromium on the rpi4 is very slow.

### Running the program

In a bash script, set the environment variables before calling ```node index.js $@```

If a json file is provided, then only those stores will be checked. If no file is provided, then all stores will be checked.

#### Environment Variables
- email_user: the email that will be used to send the emails
- email_pass: the password of the above email
- email_dest: where you want the emails to be sent

#### CLI Args
- -f or --file: a json file in the form of a list that contains the stores you want to check (make sure the names match the STORE_NAME variable in each store's index file)

### Adding more stores

The store index file should be exactly the same except for the exported variables and which items to import.

The item index file should have the same foundation (errors, return format, intial start), but the inner logic will depend on each site.

#### Required Variables (these are exported into parent folders)
- Store
    - STORE_NAME
    - ITEM_DESCRIPTOR: "Colors", "Variations", etc.
- Item
    - ITEM_NAME

#### Item return format
```
{
    error: boolean, // Set if an error happens while scraping
    results: {
        String: { // Name of the description that corresponds to ITEM_DESCRIPTOR
            link: String, // Link to item
            stock: boolean // Whether the item is in stock or not
        }
    }
}
```

### How the emailing works (and how it might be improved)

Currently the emailing works in the simplest nodemailer format. It just creates the email and sends it via gmail. 

In order for this to work, turn "Access for less secure apps" off in the desired origin email (set as email_user in the env variables). After this is turned off, nodemailer will work as desired.

#### Future improvements
- Use Oauth2 for sending emails via gmail instead of diabling access for less secure apps.
    - Use the googleapis package to send a rfc2822 encoded email.
        - emailer/mailcomposer.js converts a message object (used by nodemailer) and converts it into the correct format (base64 encoded rfc) that can be used on google's gmail api.
        - I was able to get it working on the "try api" service in google's docs and examples, but not locally.