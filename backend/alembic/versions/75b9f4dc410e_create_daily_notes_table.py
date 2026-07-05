"""create daily notes table

Revision ID: 75b9f4dc410e
Revises: b3c9c80f1f6d
Create Date: 2026-07-05 00:00:00.000000
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "75b9f4dc410e"
down_revision: Union[str, Sequence[str], None] = "b3c9c80f1f6d"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "daily_notes",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("project_id", sa.Integer(), nullable=False),
        sa.Column("title", sa.String(length=200), nullable=False),
        sa.Column("note_date", sa.Date(), nullable=True),
        sa.Column("content", sa.Text(), nullable=False),
        sa.Column("completed_tasks", sa.Text(), nullable=True),
        sa.Column("blockers", sa.Text(), nullable=True),
        sa.Column("next_steps", sa.Text(), nullable=True),
        sa.Column("ai_summary", sa.Text(), nullable=True),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.ForeignKeyConstraint(["project_id"], ["projects.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_daily_notes_id"), "daily_notes", ["id"], unique=False)
    op.create_index(
        op.f("ix_daily_notes_project_id"),
        "daily_notes",
        ["project_id"],
        unique=False,
    )


def downgrade() -> None:
    op.drop_index(op.f("ix_daily_notes_project_id"), table_name="daily_notes")
    op.drop_index(op.f("ix_daily_notes_id"), table_name="daily_notes")
    op.drop_table("daily_notes")
