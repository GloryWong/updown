import process from 'node:process'

export function askHiddenInput(question: string): Promise<string> {
  return new Promise<string>((resolve) => {
    const stdin = process.stdin
    const stdout = process.stdout

    stdout.write(question) // Display the question

    if (stdin.isTTY) {
      stdin.setRawMode(true)
    }
    stdin.resume()
    stdin.setEncoding('utf8')

    let input = ''

    stdin.on('data', (_char) => {
      const char = _char.toString()

      if (char === '\n' || char === '\r') {
        stdin.setRawMode(false)
        stdin.pause()
        stdout.write('\n') // Move to a new line after input
        resolve(input)
      } else if (char === '\u0003') {
        // Handle Ctrl+C
        process.exit()
      } else {
        input += char
        stdout.write(Array(char.length).fill('*').join('')) // Mask input
      }
    })
  })
}
