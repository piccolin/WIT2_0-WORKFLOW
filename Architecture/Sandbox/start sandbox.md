```bash
aws sso login --profile waverly-gap-temporary-access
aws sts get-caller-identity --profile waverly-gap-temporary-access
npx ampx sandbox --profile waverly-gap-temporary-access  --debug
```
