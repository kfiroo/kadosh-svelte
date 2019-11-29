<script>
	export let lang

    import { createEventDispatcher } from 'svelte'

	const dispatch = createEventDispatcher()

    function close() {
        dispatch('close')
    }

</script>

<style>
  .rules {
    position: fixed;
    top: 0px;
    left: 0px;
    right: 0px;
    height: 100vh;
    background-color: white;
    color: black;
  }
  .content {
    padding: 20px;
    height: 100%;
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
  }
  .rules-he {
    direction: rtl;
  }
  .close-rules {
    padding: 10px;
  }
  .got-it-wrapper {
    margin-bottom: 50px;
    display: flex;
    justify-content: center;
  }
</style>

{#if lang === 'he'}
<div class="rules rules-he">
    <div class="content">
        <h4>חוקי המשחק</h4>
        <p>
            מטרת המשחק היא להניח את כל קלפי התמונה (J/Q/K) על המסגרת של לוח המשחק בגודל 4x4
            <br>
            👑 מלכים בפינות
            <br>
            👸 מלכות למעלה ולמטה
            <br>
            🤴 נסיכים בימין ושמאל
        </p>
        <h4>למשחק יש 2 חלקים:</h4>
        <h5>חלק ראשון - מניחים קלפים</h5>
        <p>
            בחלק הזה המטרה היא להניח את הקלף שבראש החבילה על אחד המקומות הפנויים על הלוח
            </p><p>
            קלפים של משפחת המלוכה חייבים להניח במקום המויעד להם
            </p><p>
            את שאר הקלפים מותר להניח בכל מקום פנוי, גם על המסגרת
            </p><p>
            בשלב זה מפסידים אם יצא קלף תמונה ואין מקום להניח אותו
            </p><p>
            ממשיכים להניח קלפים עד שהלוח מלא
        </p>
        <h5>חלק 2 - מוציאים קלפים</h5>
        <p>
            בחלק זה מוציאים מהלוח זוגות של קלפים שהסכום שלהם 10 או את הקלף 10 בעצמו
            </p><p>
            לדוגמא: (5 + 5), (3 + 7) או (A + 9)
            </p><p>
            בשלב זה מפסידים אם הלוח מלא ואין מה להוציא
            </p><p>
            ממשיכים להוציא קלפים עד שאין יותר קלפים להוציא
        </p>

        <div class="got-it-wrapper">
            <button class="close-rules" on:click={close}>
                <b>הבנתיי!!🦄</b>
            </button>
        </div>
    </div>
</div>
{/if}

{#if lang === 'en'}
<div class="rules">
    <h4>Kadosh Rules</h4>
    <p>
        The goal of the game is to get all the face cards (J, Q & K) on the edges of the 4x4 playing board.
        <br>
        👑 Kings go in the corners
        <br>
        👸 Queens go on the top and bottom
        <br>
        🤴 Jacks go on the left and right
    </p>
    <p>
        The game is played in 2 phases:
    </p>
    <h5>Phase 1 - placing cards:</h5>
    <p>
        In this phase you will need to place the card at the top of the deck - its right there below the board - in one of the empty places on the board.
        Face cards can only go in their designated place.
        The rest of the cards can go where ever you want.
        <br>
        You need to place cards until the board is full or you lost.
    </p>
    <h5>Phase 2 - removing cards:</h5>
    <p>
        In this phase you will remove
    </p>

    <button class="close-rules" on:click={close}>GOT IT! 🦄</button>
</div>
{/if}