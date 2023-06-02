# claude-api
Using Claude via Slack

## How to Run
1. Rename the.env-example to.env and fill in the `SLACK_AUTH_TOKEN` and `CLAUDE_BOT_ID`
2. run `yarn` or `npm i`
3. run `yarn run dev` or `npm run dev`

## How to get `SLACK_AUTH_TOKEN` and `CLAUDE_BOT_ID`
1.Creat New App at https://api.slack.com/apps
<div>
	<img src="https://github.com/danbao/claude-api/assets/4090783/9df3d44c-e394-4c91-abfb-d4ae25ddcb47" alt="create New App" width="600">
</div>

2. Pick Slack Workspace
<div>
	<img src="https://github.com/danbao/claude-api/assets/4090783/a636790b-60b2-4f7e-bb15-08d82a4a44f4" alt="pick Slack Workspace" width="600">
</div>

3. Click `OAuth & Permission` at left sidebar to get `User OAuth Token`
<div>
	<img src="https://github.com/danbao/claude-api/assets/4090783/6c20db6a-adc3-41b2-860a-55653f78ba0f" alt="User Oauth Token" width="600">
</div>

4. Setup the Permission of your Slack App
```
channels:history
channels:write
chat:write
im:history
im:write
```
<div>
	<img src="https://github.com/danbao/claude-api/assets/4090783/4f846ebf-9cd0-4f8e-be4e-e85cd84e92fe" alt="Setup Outh And Permission" width="600">
</div>

5. Install your Slack App
<div>
	<img src="https://github.com/danbao/claude-api/assets/4090783/61363148-e320-4027-92c7-ec44d1af7077" alt="Install your Slack App" width="600">
</div>

6. Get `Claude User ID`
<div>
	<img src="https://github.com/danbao/claude-api/assets/4090783/19ffb857-4296-44a6-a209-b4bad4669a4f" alt="Get Claude User ID" width="600">
</div>
<div>
	<img src="https://github.com/danbao/claude-api/assets/4090783/5a0bca54-b6a8-4798-8077-2328bf212a4c" alt="Get Claude User ID" width="600">
</div>
