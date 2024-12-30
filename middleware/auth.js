
export default function ({ store, redirect }) {
  // If the user is not authenticated
  if (!store.state.localStorage.logged) {
    return redirect('/auth')
  } else {
    return redirect('/dashboard')
  }
}
