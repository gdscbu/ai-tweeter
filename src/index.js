import nProgress from 'nprogress'

const txtTokens = document.querySelector('#txtTokens')
const txtTweet = document.querySelector('#txtTweet')
const aTweetNow = document.querySelector('#aTweetNow')
const aGenerateTweet = document.querySelector('#aGenerateTweet')

const createTweetLink = tweet => `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweet)}`

aGenerateTweet.addEventListener('click', async () => {
    const tokens = txtTokens.value.split(',')
        .filter(token => Boolean(token))
        .map(token => token.trim())

    if (tokens.length == 0)
        return alert('Please enter at least 1 token')

    nProgress.start()
    txtTokens.disabled = true
    txtTweet.disabled = true
    aTweetNow.disabled = true
    aGenerateTweet.disabled = true

    const tweet = await fetch('https://ai-tweeter.vercel.app/api', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ tokens })
    }).then(res => res.json())

    txtTweet.value = tweet.tweet.slice(1)
    aTweetNow.classList.remove('hidden')
    aTweetNow.classList.add('flex')
    aTweetNow.href = createTweetLink(tweet.tweet.slice(1))
    txtTokens.disabled = false
    txtTweet.disabled = false
    aTweetNow.disabled = false
    aGenerateTweet.disabled = false

    nProgress.done()
})
