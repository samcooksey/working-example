### working-example
Trying to add Piral Extension to non pilet app via pilet

### How to run application
- `cd piral-shell`
- `yarn build`
- `cd ../some-react-app/`
- `yarn install`
- `yarn build`
- `cd ../mypilet1`
- `yarn install`
- `yarn start`

### Extension
`my-pilet1/SampleExtension.tsx` takes a `count` prop and renders it.

![image](https://user-images.githubusercontent.com/16233042/112190124-532c5100-8bca-11eb-92ad-43784d1a0289.png)


### Issue
inside `some-react-app/App,tsx`, we're rendering our extension using `piral.renderHTMLExtension` and passing in our `count`. We also include `count` as a dependency for `useLayoutEffect()`.

![image](https://user-images.githubusercontent.com/16233042/112190179-60e1d680-8bca-11eb-8f62-0f8e1115b9a6.png)

When the count is incremented, a new instance of the extension mounts, but the old one does not unmount.

![image](https://user-images.githubusercontent.com/16233042/112190235-6dfec580-8bca-11eb-9306-6320a3ec911e.png)
![image](https://user-images.githubusercontent.com/16233042/112190273-73f4a680-8bca-11eb-8341-63e59cc9aa97.png)


