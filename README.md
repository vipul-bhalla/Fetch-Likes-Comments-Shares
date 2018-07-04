# Fetch-Likes-Comments-Shares
```
Google Script to fetch likes/comments/shares for the fb post's links list in google sheet
```
```
Requirements:
```
1. Google Account Login
2. Facebook Graph API Access Token

```
Process:
```
1. Rename the sheet 1 of spreadsheet containing fb post links to Sheet_name01
2. Store the links in Column D starting from Row 2
3. In the adjacent sheet i.e, sheet 2, store the Facebook Graph API Access Token at location 'B1'
4. Rename sheet 2 to Sheet_name02
5. In Menu-Bar click on Tools
6. Under Tools select Script
7. Upload the Fetch_CLS to script editor and save
8. Saving the script, refresh the spreadsheet, MyApp icon will appear in Menu-Bar
9. Click on MyApp icon to run the script and there you go!!!
10. Count of likes/comments/shares start appearing in I/J/K column respectively for corresponding post link in each row