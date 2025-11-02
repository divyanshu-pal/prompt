import Groq from 'groq-sdk';
import { useState } from 'react';

const Form = ({ type, post, setPost, submitting, handleSubmit }) => {
  const [loadingPrompt, setLoadingPrompt] = useState(false);

  const client = new Groq({
    apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY,  // Using the environment variable
    dangerouslyAllowBrowser: true,  // WARNING: This exposes your API key to the browser
  });

  async function generateText(prompt) {
    try {
      setLoadingPrompt(true); // Start loading state

      // Call the Groq API directly from the frontend
      const chatCompletion = await client.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: 'llama3-8b-8192',
      });

      const generatedText = chatCompletion?.choices[0]?.message?.content;
      setPost({ ...post, prompt: generatedText });
    } catch (error) {
      console.error('Error generating text:', error);
    } finally {
      setLoadingPrompt(false); // Stop loading state
    }
  }

  return (
    <section className='w-full max-w-full flex-start flex-col'>
      <h1 className='head_text text-left'>
        <span className='blue_gradient'>{type} Post</span>
      </h1>
      <p className='desc text-left max-w-md'>
        {type} and share amazing prompts with the world, and let your
        imagination run wild with any AI-powered platform
      </p>

      <form onSubmit={handleSubmit} className='mt-10 w-full max-w-2xl flex flex-col gap-7 glassmorphism'>
        <label>
          <span className='font-satoshi font-semibold text-base text-gray-700'>
            Your AI Prompt
          </span>
          <textarea
            value={post.prompt}
            onChange={(e) => setPost({ ...post, prompt: e.target.value })}
            placeholder='Write your post here'
            required
            className='form_textarea '
          />
          <button
            type='button'
            onClick={() => generateText(post?.prompt)}
            disabled={loadingPrompt}
            className='mt-5 px-3 py-1 text-sm bg-gray-500 text-white rounded hover:bg-green-600'
          >
            {loadingPrompt ? 'Generating...' : 'Generate Prompt With The Help Of Groq'}
          </button>
        </label>

        <label>
          <span className='font-satoshi font-semibold text-base text-gray-700'>
            Field of Prompt{" "}
            <span className='font-normal'> (#product, #webdevelopment, #idea, etc.)</span>
          </span>
          <input
            value={post?.tag}
            onChange={(e) => setPost({ ...post, tag: e.target.value })}
            type='text'
            placeholder='#Tag'
            required
            className='form_input'
          />
        </label>

        <div className='flex-end mx-3 mb-5 gap-4'>
          <button type='submit' disabled={submitting} className='px-5 py-1.5 text-sm bg-primary-orange rounded-full text-white'>
            {submitting ? `${type}ing...` : type}
          </button>
        </div>
      </form>
    </section>
  );
};

export default Form;
